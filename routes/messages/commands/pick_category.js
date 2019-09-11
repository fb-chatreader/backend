const Users = require('models/db/users.js');
const Books = require('models/db/books.js');
const BookCategories = require('models/db/bookCategories.js');
const UserCategories = require('models/db/userCategories.js');

const { getNewCategoriesForUser } = require('../helpers/categories.js');

module.exports = async (event) => {
	if (event.type !== 'postback' && event.command !== 'get_started' && event.command !== 'save_email') return;
	const { user_id, category_id } = event;
	console.log(event);

	const userCategoryObjects = await UserCategories.retrieve({ user_id });
	const userCategoryIDs = userCategoryObjects.map((c) => c.category_id);

	const newCategory =
		category_id && userCategoryIDs.indexOf(category_id) === -1
			? await UserCategories.add({ user_id, category_id })
			: null;

	if (newCategory) {
		userCategoryIDs.push(newCategory.category_id);
	}

	if (!userCategoryIDs.length) return;

	return userCategoryIDs.length < 3
		? getNextFavorite(userCategoryIDs, user_id)
		: finishCategories(userCategoryIDs, event);
};

async function getNextFavorite(userCategoryIDs, user_id) {
	const remainingCategories = await getNewCategoriesForUser(user_id);

	const text = userCategoryIDs.length === 1 ? 'Thanks, now pick a second favorite:' : 'Great!  Okay, last one:';

	return [
		{
			attachment: {
				type: 'template',
				payload: {
					template_type: 'button',
					text,
					buttons: remainingCategories.map((c) => {
						// Everything except the category name must be destructured
						// for this to work
						const { id, name: title } = c;

						return {
							type: 'postback',
							title: title[0].toUpperCase() + title.substring(1),
							payload: JSON.stringify({
								command: 'pick_category',
								category_id: id
							})
						};
					})
				}
			}
		}
	];
}

async function finishCategories(userCategoryIDs, event) {
	const { user_id, page: { id: page_id } } = event;
	const user = await Users.retrieve({ id: user_id }).first();

	const text = user.email
		? 'So based on your preferences, here are some books you might like!'
		: "Great, I have what I need to make some suggestions!  Though first, I'd like to make an account for you so I can remember them across platforms.  What email address can I attach to your account?";
	// Convert IDs into names
	//   const rawCategories = await Promise.all(
	//     userCategoryIDs.map(id => Categories.retrieve({ id }).first())
	//   );
	//   const categories = cleanCategories(rawCategories);

	const carousels = user.email
		? await Promise.all(
				userCategoryIDs.map(async (category_id) => {
					const pageBooks = await BookCategories.retrieve({
						'bc.category_id': category_id,
						page_id
					});

					const pageBooksSlice = pageBooks.slice(0, 10);

					return pageBooksSlice.length
						? {
								attachment: {
									type: 'template',
									payload: {
										template_type: 'generic',
										elements: pageBooksSlice.map((b) => {
											const buttons = [];
											if (b.synopsis) {
												buttons.push({
													type: 'postback',
													title: 'Read Synopsis',
													payload: JSON.stringify({
														command: 'get_synopsis',
														book_id: b.id
													})
												});
											}
											buttons.push({
												type: 'postback',
												title: 'Start Summary',
												payload: JSON.stringify({
													command: 'get_summary',
													book_id: b.id
												})
											});
											buttons.push({
												type: 'postback',
												title: 'Save to Library',
												payload: JSON.stringify({
													command: 'save_to_library',
													book_id: b.id
												})
											});

											return {
												title: b.title,
												image_url: b.image_url,
												subtitle: `by ${b.author}`,
												buttons
											};
										})
									}
								}
							}
						: null;
				})
			)
		: null;

	return [ { text }, ...carousels ];
}
