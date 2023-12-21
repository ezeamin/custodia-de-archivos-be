import HttpStatus from 'http-status-codes';

import ProductsModel from '../models/ProductSchema.js';

// ----------------------------
// GET
// ----------------------------

// The "_" is a parameter that is not used (it would be the "req")
// but it is put so that it does not give an error (unused var)
export const getProducts = async (_, res) => {
  try {
    const data = await ProductsModel.find({ isActive: true });

    const filteredData = data.map((product) => ({
      id: product._doc._id,
      name: product._doc.name,
      price: product._doc.price,
      description: product._doc.description,
      image: product._doc.image,
    }));

    res.json({
      data: filteredData,
      message: data.length > 0 ? 'Productos encontrados' : 'Listado vacío',
    });
  } catch (err) {
    console.error('🟥', err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: {
        data: null,
        message: `ERROR: ${err}`,
      },
    });
  }
};

export const getProduct = async (req, res) => {
  // params is what comes inside the endpoint url as data (see endpoint route)
  const {
    params: { id },
  } = req;

  try {
    const data = await ProductsModel.findOne({ _id: id, isActive: true });

    const filteredData = {
      id: data._doc._id,
      name: data._doc.name,
      price: data._doc.price,
      description: data._doc.description,
      image: data._doc.image,
    };

    res.json({
      data: filteredData,
      message: data ? 'Producto encontrado' : 'Producto no encontrado',
    });
  } catch (err) {
    console.error('🟥', err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: {
        data: null,
        message: `ERROR: ${err}`,
      },
    });
  }
};

// ----------------------------
// POST
// ----------------------------

export const postProduct = async (req, res) => {
  const { body } = req;

  const newProduct = new ProductsModel({
    name: body.name.trim(),
    price: body.price,
    description: body.description.trim(),
    image: body.image.trim(),
    isActive: true,
  });

  try {
    await newProduct.save();

    res.json({
      data: null,
      message: 'Producto creado exitosamente',
    });
  } catch (err) {
    console.error('🟥', err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: {
        data: null,
        message: `ERROR: ${err}`,
      },
    });
  }
};

// ----------------------------
// PUT
// ----------------------------

export const putProduct = async (req, res) => {
  // We read the id and data of the product to update
  const {
    params: { id },
    body,
  } = req;

  // Trim body fields
  Object.keys(body).forEach((key) => {
    if (typeof body[key] === 'string') {
      body[key] = body[key].trim();
    }
  });

  try {
    // (filter,newData)
    const action = await ProductsModel.updateOne({ _id: id }, body);

    // matchedCount says how many elements were found to be modified
    if (action.matchedCount === 0) {
      res.status(HttpStatus.NOT_FOUND).json({
        data: null,
        message: 'Producto no encontrado',
      });
      return;
    }

    res.json({
      data: null,
      message: 'Producto actualizado',
    });
  } catch (err) {
    console.error('🟥', err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: {
        data: null,
        message: `ERROR: ${err}`,
      },
    });
  }
};

// ----------------------------
// DELETE
// ----------------------------

export const deleteProduct = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const action = await ProductsModel.updateOne(
      { _id: id, isActive: true },
      { isActive: false },
    );

    if (action.matchedCount === 0) {
      res.status(HttpStatus.NOT_FOUND).json({
        data: null,
        message: 'Producto no encontrado',
      });
      return;
    }

    res.json({
      data: null,
      message: 'Producto eliminado',
    });
  } catch (err) {
    console.error('🟥', err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: {
        data: null,
        message: `ERROR: ${err}`,
      },
    });
  }
};
