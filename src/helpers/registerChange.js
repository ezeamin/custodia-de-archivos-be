import { prisma } from './prisma.js';

export const registerChange = async ({
  changedField,
  changedFieldLabel,
  previousValue,
  newValue,
  modifyingUser,
  employeeId,
}) => {
  console.log('🟢', {
    changedField,
    changedFieldLabel,
    previousValue,
    newValue,
    modifyingUser,
    employeeId,
  });

  try {
    await prisma.employee_history.create({
      data: {
        id_modifying_user: modifyingUser,
        id_employee: employeeId,
        modified_field: changedField,
        modified_field_label: changedFieldLabel,
        current_value: newValue,
        previous_value: previousValue,
      },
    });
  } catch (e) {
    console.error('🟥', e);
  }
};
