const Bus = require("../models/Bus");
const Booking = require("../models/Booking");

// ── Get buses with booked seats ─────────────────────────
const getBuses = async (req, res) => {
  try {
    const { from, to, date } = req.query;

    const filter = {};

    if (from) filter.from = { $regex: `^${from}$`, $options: "i" };
    if (to) filter.to = { $regex: `^${to}$`, $options: "i" };
    if (date) filter.date = date;

    const buses = await Bus.find(filter).lean();

    const busesWithBookedSeats = await Promise.all(
      buses.map(async (bus) => {
        const bookings = await Booking.find({
          operator: bus.name,
          date: bus.date,
          status: "CONFIRMED"
        }).select("seats -_id");

        const bookedSeats = bookings.flatMap((booking) => booking.seats || []);

        return {
          ...bus,
          bookedSeats
        };
      })
    );

    res.status(200).json(busesWithBookedSeats);
  } catch (error) {
    console.error("Get buses error:", error);
    res.status(500).json({
      message: "Failed to fetch buses",
      error: error.message
    });
  }
};

// ── Seed buses ──────────────────────────────────────────
const seedBuses = async (req, res) => {
  try {
    const deleted = await Bus.deleteMany({});
    console.log("Deleted buses:", deleted.deletedCount);

    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    const dayAfter = new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0];

    const seatLayout = [
      "A1", "A2", "A3", "A4",
      "B1", "B2", "B3", "B4",
      "C1", "C2", "C3", "C4",
      "D1", "D2", "D3", "D4",
      "E1", "E2", "E3", "E4"
    ];

    const sampleBuses = [
      {
        name: "VRL Travels",
        busNumber: "VRL101",
        from: "Chennai",
        to: "Bangalore",
        date: today,
        departureTime: "10:00 PM",
        arrivalTime: "5:00 AM",
        duration: "7h",
        price: 799,
        busType: "AC Sleeper",
        rating: 4.5,
        seats: seatLayout
      },
      {
        name: "SRS Travels",
        busNumber: "SRS102",
        from: "Chennai",
        to: "Hyderabad",
        date: today,
        departureTime: "9:30 PM",
        arrivalTime: "7:00 AM",
        duration: "9h 30m",
        price: 999,
        busType: "AC Seater",
        rating: 4.2,
        seats: seatLayout
      },
      {
        name: "KPN Travels",
        busNumber: "KPN103",
        from: "Bangalore",
        to: "Chennai",
        date: today,
        departureTime: "11:00 PM",
        arrivalTime: "6:00 AM",
        duration: "7h",
        price: 699,
        busType: "Non-AC Sleeper",
        rating: 4.0,
        seats: seatLayout
      },
      {
        name: "Orange Travels",
        busNumber: "ORG104",
        from: "Hyderabad",
        to: "Chennai",
        date: today,
        departureTime: "8:00 PM",
        arrivalTime: "6:30 AM",
        duration: "10h 30m",
        price: 1099,
        busType: "AC Sleeper",
        rating: 4.7,
        seats: seatLayout
      },
      {
        name: "APSRTC",
        busNumber: "APS105",
        from: "Kadapa",
        to: "Chennai",
        date: today,
        departureTime: "7:00 PM",
        arrivalTime: "1:00 AM",
        duration: "6h",
        price: 499,
        busType: "AC Seater",
        rating: 3.9,
        seats: seatLayout
      },
      {
        name: "TSRTC",
        busNumber: "TS106",
        from: "Nandyal",
        to: "Hyderabad",
        date: today,
        departureTime: "6:30 PM",
        arrivalTime: "3:30 AM",
        duration: "9h",
        price: 599,
        busType: "Non-AC Seater",
        rating: 4.1,
        seats: seatLayout
      },
      {
        name: "VRL Travels",
        busNumber: "VRL201",
        from: "Chennai",
        to: "Bangalore",
        date: tomorrow,
        departureTime: "10:00 PM",
        arrivalTime: "5:00 AM",
        duration: "7h",
        price: 849,
        busType: "AC Sleeper",
        rating: 4.5,
        seats: seatLayout
      },
      {
        name: "SRS Travels",
        busNumber: "SRS202",
        from: "Chennai",
        to: "Hyderabad",
        date: tomorrow,
        departureTime: "9:30 PM",
        arrivalTime: "7:00 AM",
        duration: "9h 30m",
        price: 1049,
        busType: "AC Seater",
        rating: 4.2,
        seats: seatLayout
      },
      {
        name: "KPN Travels",
        busNumber: "KPN203",
        from: "Bangalore",
        to: "Chennai",
        date: tomorrow,
        departureTime: "11:00 PM",
        arrivalTime: "6:00 AM",
        duration: "7h",
        price: 749,
        busType: "Non-AC Sleeper",
        rating: 4.0,
        seats: seatLayout
      },
      {
        name: "Orange Travels",
        busNumber: "ORG204",
        from: "Hyderabad",
        to: "Chennai",
        date: tomorrow,
        departureTime: "8:00 PM",
        arrivalTime: "6:30 AM",
        duration: "10h 30m",
        price: 1149,
        busType: "AC Sleeper",
        rating: 4.7,
        seats: seatLayout
      },
      {
        name: "VRL Travels",
        busNumber: "VRL301",
        from: "Chennai",
        to: "Bangalore",
        date: dayAfter,
        departureTime: "10:00 PM",
        arrivalTime: "5:00 AM",
        duration: "7h",
        price: 799,
        busType: "AC Sleeper",
        rating: 4.5,
        seats: seatLayout
      },
      {
        name: "SRS Travels",
        busNumber: "SRS302",
        from: "Chennai",
        to: "Hyderabad",
        date: dayAfter,
        departureTime: "9:30 PM",
        arrivalTime: "7:00 AM",
        duration: "9h 30m",
        price: 999,
        busType: "AC Seater",
        rating: 4.2,
        seats: seatLayout
      }
    ];

    const created = await Bus.insertMany(sampleBuses);

    res.status(201).json({
      message: "Buses seeded successfully",
      deleted: deleted.deletedCount,
      count: created.length,
      buses: created
    });
  } catch (error) {
    console.error("Seed buses error:", error);
    res.status(500).json({
      message: "Failed to seed buses",
      error: error.message
    });
  }
};

module.exports = { getBuses, seedBuses };