const emailTemplates = {
  dueDateReminderBefore: (taskName, assigneeFirstName, dueDate) => ({
    subject: `Your task (${taskName}) is due on ${dueDate}`,
    body: `
      Dear ${assigneeFirstName},

      Your task (${taskName}) is due on ${dueDate}. Please take action immediately.

      Regards,
      Agency name
    `,
  }),

  dueDateReminderAfter: (taskName, assigneeFirstName, dueDate) => ({
    subject: `Your task (${taskName}) is overdue on ${dueDate}`,
    body: `
      Dear ${assigneeFirstName},

      Your task (${taskName}) is overdue on ${dueDate}. Please take action immediately.

      Regards,
      Agency name
    `,
  }),

  assignTask: (taskName, assigneeFirstName) => ({
    subject: `New Task (${taskName}) has been assigned to your queue`,
    body: `
      Dear ${assigneeFirstName},

      A new task (${taskName}) has been assigned to your queue. Please take action immediately.

      Regards,
      Agency name
    `,
  }),
};

export default emailTemplates;
