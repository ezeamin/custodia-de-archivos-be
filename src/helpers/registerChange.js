import { prisma } from './prisma.js';

export const registerChange = async ({
  changedField,
  changedFieldLabel,
  changedTable,
  previousValue,
  newValue,
  modifyingUser,
  employeeId,
}) => {
  try {
    await prisma.employee_history.create({
      data: {
        id_submitted_by: modifyingUser,
        id_employee: employeeId,
        modified_table: changedTable,
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
