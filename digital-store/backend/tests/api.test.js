const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

// 1x1 pixel PNG
const PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

let token;
let auth;

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Usuários e JWT', () => {
  let userId;

  it('POST /v1/user cria usuário (201) sem exigir token', async () => {
    const res = await request(app).post('/v1/user').send({
      firstname: 'Maria',
      surname: 'Silva',
      email: 'maria@mail.com',
      password: '123@123',
      confirmPassword: '123@123',
    });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ firstname: 'Maria', email: 'maria@mail.com' });
    expect(res.body.password).toBeUndefined();
    userId = res.body.id;
  });

  it('POST /v1/user retorna 400 se as senhas não conferem', async () => {
    const res = await request(app).post('/v1/user').send({
      firstname: 'A',
      surname: 'B',
      email: 'a@mail.com',
      password: '123@123',
      confirmPassword: 'outra',
    });
    expect(res.status).toBe(400);
  });

  it('POST /v1/user/token gera JWT (200) e rejeita senha errada (400)', async () => {
    const bad = await request(app).post('/v1/user/token').send({ email: 'maria@mail.com', password: 'x' });
    expect(bad.status).toBe(400);

    const res = await request(app).post('/v1/user/token').send({ email: 'maria@mail.com', password: '123@123' });
    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe('string');
    token = res.body.token;
    auth = { Authorization: `Bearer ${token}` };
  });

  it('GET /v1/user/:id retorna 200 e 404', async () => {
    const ok = await request(app).get(`/v1/user/${userId}`);
    expect(ok.status).toBe(200);
    expect(ok.body).toEqual({ id: userId, firstname: 'Maria', surname: 'Silva', email: 'maria@mail.com' });
    expect((await request(app).get('/v1/user/9999')).status).toBe(404);
  });

  it('PUT /v1/user/:id exige token (400 sem header, 401 inválido, 204 ok)', async () => {
    const body = { firstname: 'Maria', surname: 'Souza', email: 'maria@mail.com' };
    expect((await request(app).put(`/v1/user/${userId}`).send(body)).status).toBe(400);
    expect(
      (await request(app).put(`/v1/user/${userId}`).set('Authorization', 'Bearer invalido').send(body)).status
    ).toBe(401);
    expect((await request(app).put(`/v1/user/${userId}`).set(auth).send(body)).status).toBe(204);
    expect((await request(app).put('/v1/user/9999').set(auth).send(body)).status).toBe(404);
  });
});

describe('Categorias', () => {
  let categoryId;

  it('POST /v1/category cria (201)', async () => {
    const res = await request(app).post('/v1/category').set(auth).send({ name: 'Shoes', slug: 'shoes', use_in_menu: true });
    expect(res.status).toBe(201);
    categoryId = res.body.id;
    await request(app).post('/v1/category').set(auth).send({ name: 'Black Friday', slug: 'black-friday' });
  });

  it('GET /v1/category/search pagina, filtra e limita campos', async () => {
    const all = await request(app).get('/v1/category/search?limit=-1');
    expect(all.status).toBe(200);
    expect(all.body).toMatchObject({ total: 2, limit: -1, page: 1 });

    const menu = await request(app).get('/v1/category/search?use_in_menu=true&fields=name,slug');
    expect(menu.body.data).toEqual([{ name: 'Shoes', slug: 'shoes' }]);

    expect((await request(app).get('/v1/category/search?limit=abc')).status).toBe(400);
  });

  it('GET/PUT /v1/category/:id', async () => {
    const res = await request(app).get(`/v1/category/${categoryId}`);
    expect(res.body).toEqual({ id: categoryId, name: 'Shoes', slug: 'shoes', use_in_menu: true });
    const upd = await request(app)
      .put(`/v1/category/${categoryId}`)
      .set(auth)
      .send({ name: 'Tênis', slug: 'tenis', use_in_menu: true });
    expect(upd.status).toBe(204);
    expect((await request(app).get('/v1/category/9999')).status).toBe(404);
  });
});

describe('Produtos', () => {
  let productId;

  it('POST /v1/product cria com imagens base64, opções e categorias (201)', async () => {
    const res = await request(app)
      .post('/v1/product')
      .set(auth)
      .send({
        enabled: true,
        name: 'Produto 01',
        slug: 'produto-01',
        stock: 10,
        description: 'Descrição do produto 01',
        price: 119.9,
        price_with_discount: 99.9,
        category_ids: [1],
        images: [{ type: 'image/png', content: PNG_BASE64 }],
        options: [
          { title: 'Tamanho', shape: 'square', radius: '4px', type: 'text', value: ['PP', 'GG', 'M'] },
          { title: 'Cor', shape: 'circle', type: 'color', values: ['#000', '#333'] },
        ],
      });
    expect(res.status).toBe(201);
    productId = res.body.id;
    expect(res.body.category_ids).toEqual([1]);
    expect(res.body.images[0].content).toMatch(/\/media\/uploads\/.+\.png$/);
    expect(res.body.options[0]).toMatchObject({ radius: 4, values: ['PP', 'GG', 'M'] });
  });

  it('POST /v1/product valida payload (400) e categoria inexistente (400)', async () => {
    expect((await request(app).post('/v1/product').set(auth).send({ name: 'x' })).status).toBe(400);
    const res = await request(app)
      .post('/v1/product')
      .set(auth)
      .send({ name: 'x', slug: 'x', price: 1, price_with_discount: 1, category_ids: [999] });
    expect(res.status).toBe(400);
  });

  it('GET /v1/product/search aplica filtros', async () => {
    await request(app)
      .post('/v1/product')
      .set(auth)
      .send({ name: 'Camiseta', slug: 'camiseta', price: 300, price_with_discount: 250, category_ids: [2] });

    const all = await request(app).get('/v1/product/search');
    expect(all.body).toMatchObject({ total: 2, limit: 12, page: 1 });

    const match = await request(app).get('/v1/product/search?match=Camis');
    expect(match.body.data.map((p) => p.name)).toEqual(['Camiseta']);

    const cat = await request(app).get('/v1/product/search?category_ids=1');
    expect(cat.body.total).toBe(1);

    const range = await request(app).get('/v1/product/search?price-range=200-300&fields=name,price');
    expect(range.body.data).toEqual([{ name: 'Camiseta', price: 300 }]);

    const product = await request(app).get(`/v1/product/${productId}`);
    const optionId = product.body.options[0].id;
    const opt = await request(app).get(`/v1/product/search?option[${optionId}]=GG,XX`);
    expect(opt.body.data.map((p) => p.id)).toEqual([productId]);

    expect((await request(app).get('/v1/product/search?price-range=abc')).status).toBe(400);
  });

  it('PUT /v1/product/:id atualiza imagens e opções (204)', async () => {
    const before = await request(app).get(`/v1/product/${productId}`);
    const [img] = before.body.images;
    const [size, color] = before.body.options;

    const res = await request(app)
      .put(`/v1/product/${productId}`)
      .set(auth)
      .send({
        name: 'Produto 01 atualizado',
        price_with_discount: 0,
        category_ids: [1, 2],
        images: [{ type: 'image/png', content: PNG_BASE64 }, { id: img.id, deleted: true }],
        options: [
          { id: color.id, deleted: true },
          { id: size.id, radius: '10px', value: ['42/43', '44/45'] },
          { title: 'Tipo', shape: 'square', type: 'text', values: ['100% algodão'] },
        ],
      });
    expect(res.status).toBe(204);

    const after = await request(app).get(`/v1/product/${productId}`);
    expect(after.body.name).toBe('Produto 01 atualizado');
    expect(after.body.category_ids).toEqual([1, 2]);
    expect(after.body.images).toHaveLength(1);
    expect(after.body.images[0].id).not.toBe(img.id);
    expect(after.body.options.map((o) => o.title)).toEqual(['Tamanho', 'Tipo']);
    expect(after.body.options[0]).toMatchObject({ radius: 10, values: ['42/43', '44/45'] });
  });

  it('DELETE /v1/product/:id (204, depois 404)', async () => {
    expect((await request(app).delete(`/v1/product/${productId}`)).status).toBe(400);
    expect((await request(app).delete(`/v1/product/${productId}`).set(auth)).status).toBe(204);
    expect((await request(app).get(`/v1/product/${productId}`)).status).toBe(404);
    expect((await request(app).delete(`/v1/product/${productId}`).set(auth)).status).toBe(404);
  });
});

describe('Remoções', () => {
  it('DELETE /v1/category/:id e /v1/user/:id', async () => {
    expect((await request(app).delete('/v1/category/1').set(auth)).status).toBe(204);
    expect((await request(app).delete('/v1/category/1').set(auth)).status).toBe(404);
    expect((await request(app).delete('/v1/user/1').set(auth)).status).toBe(204);
    expect((await request(app).get('/v1/user/1')).status).toBe(404);
  });
});
