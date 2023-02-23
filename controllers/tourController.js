const Tour = require("./../models/tourModel");

// ALIASING END-POINT
// localhost:3000/api/v1/tours/top-5-cheap
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "-ratingsAverage, price";
  req.query.fields = "name, price, ratingsAverage, summary, difficulty";
  next();
};

// ok
exports.getAllTours = async (req, res) => {
  try {
    //  BUILD QUERY
    //1.a SIMPLE FILTERING
    const excludedFields = ["page", "sort", "limit", "fields"];
    const queryObj = { ...req.query }; //don't want to change original
    excludedFields.forEach((el) => delete queryObj[el]);

    //1.b ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    //localhost:3000/api/v1/tours/?duration[gte]=5&difficulty=easy&price[lt]=1500
    // console.log(JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr));

    // 2  SORTING
    // localhost:3000/api/v1/tours/?sort=price   //ascending
    // localhost:3000/api/v1/tours/?sort=-price   //descending
    // localhost:3000/api/v1/tours/?sort=price,ratingsAverage  // multi fields

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // 3 PROJECTION(FIELD LIMITING)
    // localhost:3000/api/v1/tours/?fields=name,duration,difficulty,price
    // localhost:3000/api/v1/tours/?fields=-maxGroupSize // execpt
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join("  ");
      query = query.select(fields);
    } else {
      query = query.select("-__v"); // mongodb uses this internally
    }

    // PAGINATION
    // localhost:3000/api/v1/tours/?page=1&limit=3
    // Convert page and limit params to number or set default values
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    // Handle non existing page number
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error("This page does not exist");
    }

    // 2. EXECUTE THE QUERY
    const tours = await query;

    // 3. SEND DATA
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

//ok
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

//ok
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent",
    });
  }
};

//ok
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //return the new doc instead of the old
      runValidators: true, // validate incoming data against schema
    });
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: "Invalid data sent",
    });
  }
};

//ok
exports.deleteTour = async (req, res) => {
  try {
    // I RESTFUL API It's common to not send back deleted data to client.
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: "Invalid data sent",
    });
  }
};