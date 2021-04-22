import { connectToDatabase } from "../../util/mongodb";

export default async (req, res) => {
	const { db } = await connectToDatabase();

	const venues = await db
		.collection("venues")
		.find({})
		.sort({ metacritic: -1 })
		.limit(20)
		.toArray();

	res.json(venues);
};
