import { connectToDatabase } from "../../util/mongodb";

export default async (req, res) => {
	const { db } = await connectToDatabase();

	const venues = await db.collection("venues").find({});

	res.json(venues);
};
