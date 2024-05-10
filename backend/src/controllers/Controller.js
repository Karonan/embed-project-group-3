
export const createItem = async (req, res) => {
  console.log(req.body);
  res.status(200).json({ message: "OK" });
};


export const getItems = async (req, res) => {
  res.status(200).json(items);
};
