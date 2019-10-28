module.exports = {
  evaluate,
  action
};

async function evaluate() {
  const { user_id, event } = this;
  const [UserCategories] = this.withDBs('userCategories');

  const userCategories = await UserCategories.retrieve({ user_id });

  return (
    userCategories.length >= 3 &&
    event.user.email &&
    event.user.prefersLongSummaries !== null
  );
}

async function action() {
  const { user_id, event } = this;
  const [UserCategories, Users] = this.withDBs('userCategories', 'users');

  const userCategories = await UserCategories.retrieve({ user_id });
  if (userCategories.length < 3) {
    return this.overrideCommand('pick_category');
  }

  if (!event.user.email) {
    return this.overrideCommand('request_email');
  }

  if (event.hasOwnProperty('prefersLongSummaries')) {
    // event.prefersLongSummaries will exist on the postback
    // from request_summary_preference
    const { prefersLongSummaries } = event;
    const updatedUser = await Users.edit(
      { id: user_id },
      { prefersLongSummaries }
    );
    event.user = updatedUser;
  } else if (event.user.prefersLongSummaries === null) {
    return this.overrideCommand('request_summary_preference');
  }
}
