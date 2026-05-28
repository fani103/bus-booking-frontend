const PDFDocument = require("pdfkit");

function generateTicketPDF(booking, qrImage) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 0 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // Background
      doc.rect(0, 0, 595, 842).fill("#f3f4f6");

      // Card
      doc.roundedRect(40, 40, 515, 760, 20).fill("#ffffff");

      // Header
      doc.roundedRect(40, 40, 515, 100, 20).fill("#0f766e");

      doc
        .fillColor("#ffffff")
        .fontSize(26)
        .text("Fun Travels", 40, 70, { align: "center", width: 515 });

      doc
        .fontSize(13)
        .text("Booking Confirmed Ticket", 40, 100, {
          align: "center",
          width: 515
        });

      // Status badge
      doc.roundedRect(420, 160, 100, 28, 14).fill("#dcfce7");

      doc
        .fillColor("#16a34a")
        .fontSize(11)
        .text("CONFIRMED", 420, 168, {
          align: "center",
          width: 100
        });

      let y = 160;

      // Title
      doc.fillColor("#111827").fontSize(16).text("Ticket Details", 80, y);
      y += 30;

      // Row function
      const row = (label, value) => {
        doc.fillColor("#6b7280").fontSize(10).text(label, 80, y);
        doc.fillColor("#111827").fontSize(12).text(value || "-", 220, y);
        y += 22;
      };

      row("Booking ID", booking.bookingId);
      row("Passenger", booking.passenger);
      row("Phone", booking.phone);
      row("Email", booking.email);
      row("Route", `${booking.from} to ${booking.to}`);
      row("Date", booking.date);
      row("Bus", booking.operator);
      row("Bus Type", booking.type);
      row("Seats", booking.seats.join(", "));
      row("Boarding", booking.boarding);
      row("Dropping", booking.dropping);

      // Amount box
      y += 15;

      doc.roundedRect(80, y, 400, 60, 12).fill("#eff6ff");

      doc
        .fillColor("#2563eb")
        .fontSize(12)
        .text("Total Amount", 100, y + 10);

      doc
        .fillColor("#111827")
        .fontSize(20)
        .text(`Rs. ${booking.grandTotal}`, 100, y + 30);

      y += 90;

      // QR
      if (qrImage) {
        const qr = Buffer.from(
          qrImage.replace(/^data:image\/png;base64,/, ""),
          "base64"
        );

        doc
          .fillColor("#111827")
          .fontSize(12)
          .text("Scan for verification", 80, y, {
            align: "center",
            width: 400
          });

        doc.image(qr, 230, y + 20, { width: 120 });
        y += 160;
      }

      // Note
      doc.roundedRect(80, y, 400, 50, 10).fill("#ecfeff");

      doc
        .fillColor("#0f766e")
        .fontSize(10)
        .text("Arrive 20 minutes early at boarding point", 100, y + 15, {
          width: 360,
          align: "center"
        })
        .text("Thank you for choosing Fun Travels", 100, y + 30, {
          width: 360,
          align: "center"
        });

      // Footer
      doc
        .fillColor("#9ca3af")
        .fontSize(9)
        .text("Computer generated ticket • No signature required", 40, 810, {
          align: "center",
          width: 515
        });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = generateTicketPDF;