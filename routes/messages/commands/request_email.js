module.exports = async event => {
  //   const textResponses = {
  //     pick_category:
  //       "Great, I have what I need to make some suggestions!  Though first, I'd like to make an account for you so I can remember your preferences across platforms.  What email address can I attach to your account?",
  //     get_started:
  //       'I have some suggestions ready to go for you, just respond with a valid email and I can get them right to you!',
  //     default:
  //       "We use an email address to identify you across platforms.  Type a valid email address at any time and I'll save it to your account so you can proceed!"
  //   };

  //   const text = textResponses[event.command]
  //     ? textResponses[event.command]
  //     : textResponses.default;

  return [
    {
      text:
        'Looks like I need an email address from you first!  This will let me identify you across platforms!  Feel free to type your email at any time.'
    }
  ];
};
