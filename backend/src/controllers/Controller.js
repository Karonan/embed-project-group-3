var Data = {pumpMode:-1,waterHeight:0,pumpStatus:-1};
console.log(Data);
export const updateHeight = async (req, res) => {
  Data.waterHeight = req.body.height
  res.status(200).json({ message: "OK" });
};

export const togglePump = async (req, res) => {
  pumpMode = pumpMode*(-1);
  res.status(200).json({ message: "OK" });
};


export const setMode = async (req, res) => {
  pumpMode = pumpStatus*(-1);
  res.status(200).json({ message: "OK" });
};

export const getStatus = async (req, res) => {
  res.status(200).json(Data);
};


/*
res.status(200).json(items);
*/