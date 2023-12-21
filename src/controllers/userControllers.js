import bcrypt from 'bcryptjs';
import HttpStatus from 'http-status-codes';

import UsersModel from '../models/UserSchema.js';

// ----------------------------
// GET
// ----------------------------

export const getUsers = async (_, res) => {
  try {
    const data = await UsersModel.find();

    // remove "password" and "isActive" from response
    const filteredData = data.map((user) => ({
      id: user._doc._id,
      firstname: user._doc.firstname,
      lastname: user._doc.lastname,
      username: user._doc.username,
      isAdmin: user._doc.isAdmin,
    }));

    res.json({
      data: filteredData,
      message:
        filteredData.length > 0 ? 'Usuarios encontrados' : 'Listado vacío',
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

export const getUser = async (req, res) => {
  const {
    params: { id },
    user,
  } = req;

  // You can only see your own profile or, if you are admin, all
  if (id !== user._id && !user.isAdmin) {
    res.status(HttpStatus.FORBIDDEN).json({
      data: null,
      message: 'No tienes permisos para realizar esta acción',
    });
    return;
  }

  try {
    const data = await UsersModel.findOne({ _id: id });

    if (!data) {
      res.status(HttpStatus.NOT_FOUND).json({
        data: null,
        message: 'Usuario no encontrado',
      });
      return;
    }

    const filteredData = {
      id: data._doc._id,
      firstname: data._doc.firstname,
      lastname: data._doc.lastname,
      username: data._doc.username,
      isAdmin: data._doc.isAdmin,
    };

    res.json({
      data: filteredData,
      message: 'Usuario encontrado',
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

export const postUser = async (req, res) => {
  const { body } = req;

  const cryptedPassword = bcrypt.hashSync(body.password.trim(), 10);

  const newUser = new UsersModel({
    firstname: body.firstname.trim(),
    lastname: body.lastname.trim(),
    username: body.username.trim(),
    password: cryptedPassword,
    isActive: true,
    isAdmin: false,
  });

  try {
    await newUser.save();

    res.json({
      data: null,
      message: 'Usuario creado exitosamente',
    });
  } catch (err) {
    console.error('🟥', err);

    if (err.message.includes('duplicate')) {
      res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        message: `El usuario con username "${body.username}" ya existe`,
      });
      return;
    }

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

export const putUser = async (req, res) => {
  const {
    params: { id },
    user,
    body,
  } = req;

  // You can only edit your own profile or, if you are admin, all
  if (id !== user._id && !user.isAdmin) {
    res.status(HttpStatus.FORBIDDEN).json({
      data: null,
      message: 'No tienes permisos para realizar esta acción',
    });
    return;
  }

  // A not admin user can't set itself as one (or try to modify that value)
  if (!user.isAdmin && 'isAdmin' in body) {
    res.status(HttpStatus.FORBIDDEN).json({
      data: null,
      message:
        'No tienes permisos para configurar los usuarios administradores',
    });
    return;
  }

  // Trim body fields
  Object.keys(body).forEach((key) => {
    if (typeof body[key] === 'string') {
      body[key] = body[key].trim();
    }
  });

  if (body.password) {
    const cryptedPassword = bcrypt.hashSync(body.password, 10);
    body.password = cryptedPassword;
  }

  try {
    const action = await UsersModel.updateOne({ _id: id }, body);

    if (action.matchedCount === 0) {
      res.status(HttpStatus.NOT_FOUND).json({
        data: null,
        message: 'Usuario no encontrado',
      });
      return;
    }

    res.json({
      data: null,
      message: 'Usuario actualizado exitosamente',
    });
  } catch (err) {
    if (err.message.includes('duplicate')) {
      res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        message: `El usuario con username "${body.username}" ya existe`,
      });
      return;
    }

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

// Only change isActive property
export const deleteUser = async (req, res) => {
  const {
    params: { id },
    user,
  } = req;

  // You can only delete your own profile or, if you are admin, all
  if (id !== user._id && !user.isAdmin) {
    res.status(HttpStatus.FORBIDDEN).json({
      data: null,
      message: 'No tienes permisos para realizar esta acción',
    });
    return;
  }

  try {
    const action = await UsersModel.updateOne(
      {
        _id: id, // condition #1
        isActive: true, // condition #2
      },
      {
        isActive: false, // what to update
      },
    );

    if (action.matchedCount === 0) {
      res.status(HttpStatus.NOT_FOUND).json({
        data: null,
        message: 'Usuario no encontrado',
      });
      return;
    }

    res.json({
      data: null,
      message: 'Usuario eliminado exitosamente',
    });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: {
        data: null,
        message: `ERROR: ${err}`,
      },
    });
  }
};
