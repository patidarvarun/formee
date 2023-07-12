import moment from "moment";

const RESTAURANT_ORDER_TYPE_STATUS = [
  { label: "Confirmed", value: "confirmed" },
  { label: "In the Kitchen", value: "in-the-kitchen" },
  { label: "On the way", value: "on-the-way" },
  { label: "Waiting for pick up", value: "waiting-for-pick-up" },
  { label: "Delivered", value: "delivered" },
  { label: "Complete", value: "complete" },
  { label: "Order Received", value: "order-received" },
  { label: "Cancel", value: "cancelled" },
  { label: "Ready for Pickup", value: "food-is-ready-for-pickup" },
  { label: "Accepted", value: "accepted" },
  { label: "Pending", value: "pending" },
];

export const getOrderTypeName = (orderType) => {
  switch (orderType) {
    case "delivery":
      return "Delivery";
    case "take_away":
      return "Pickup";
    default:
      return "";
  }
};

export const getOrderStatus = (orderStatus) => {
  const filteredOrderStatus = RESTAURANT_ORDER_TYPE_STATUS.filter(
    (el) => el.value === orderStatus
  );
  return filteredOrderStatus;
};

export const DISPUTE_REASON = [
  {
    label: "Merchandise/Services Not Received",
    value: "Merchandise/Services Not Received",
  },
  {
    label: "Not as Described or Defective Merchandise/Services",
    value: "Not as Described or Defective Merchandise/Services",
  },
  {
    label: "Counterfeit Merchandise - Cancelled Merchandise/Services",
    value: "Counterfeit Merchandise - Cancelled Merchandise/Services",
  },
  {
    label: "Goods/Services Damaged or Defective - Not Show ",
    value: "Goods/Services Damaged or Defective - Not Show ",
  },
  { label: "Other", value: "Other" },
];

const STATUS_WITH_COLOR = [
  {
    label: "order-received",
    value: "Pending",
    statusColor: "#FFC468",
    btnClass: "pending-btn",
  },

  {
    label: "Order Received",
    value: "Pending",
    statusColor: "#FFC468",
    btnClass: "pending-btn",
  },

  {
    label: "Pending",
    value: "Pending",
    statusColor: "#FFC468",
    btnClass: "pending-btn",
  },
  {
    label: "Ready for Pickup",
    value: "Ready for Pickup",
    statusColor: "#FFC468",
    btnClass: "pending-btn",
  },
  {
    label: "food-is-ready-for-pickup",
    value: "food-is-ready-for-pickup",
    statusColor: "#FFC468",
    btnClass: "pending-btn",
  },
  {
    label: "Paid",
    value: "Paid",
    statusColor: "#2ED47A",
    btnClass: "success-btn",
  },
  {
    label: "Interview",
    value: "Interview",
    statusColor: "#2ED47A",
    btnClass: "success-btn",
  },
  {
    label: "Inspection",
    value: "Inspection",
    statusColor: "#2ED47A",
    btnClass: "success-btn",
  },
  {
    label: "delivered",
    value: "Delivered",
    statusColor: "#2ED47A",
    btnClass: "delivered-btn",
  },
  {
    label: "Delivered",
    value: "Delivered",
    statusColor: "#2ED47A",
    btnClass: "delivered-btn",
  },

  {
    label: "Completed",
    value: "Completed",
    statusColor: "#363B40",
    btnClass: "success-btn",
  },
  {
    label: "confirmed",
    value: "Completed",
    statusColor: "#363B40",
    btnClass: "success-btn",
  },

  {
    label: "Done",
    value: "Done",
    statusColor: "#2ED47A",
    btnClass: "success-btn",
  },
  {
    label: "Upcoming",
    value: "Upcoming",
    statusColor: "#2ED47A",
    btnClass: "success-btn",
  },
  {
    label: "Active",
    value: "Active",
    statusColor: "#2ED47A",
    btnClass: "success-btn",
  },
  {
    label: "delivered ",
    value: "Being Delivered",
    statusColor: "#2ED47A",
    btnClass: "success-btn",
  },
  {
    label: "on-the-way",
    value: "On the Way",
    statusColor: "#FFC468",
    btnClass: "pending-btn",
  },
  {
    label: "On the way",
    value: "On the Way",
    statusColor: "#FFC468",
    btnClass: "pending-btn",
  },

  {
    label: "Order Accepted",
    value: "Order Accepted",
    statusColor: "#5D3F96",
    btnClass: "purple",
  },
  {
    label: "Accept Offer",
    value: "Accept Offer",
    statusColor: "#5D3F96",
    btnClass: "purple",
  },
  {
    label: "Shipped",
    value: "Shipped",
    statusColor: "#5D3F96",
    btnClass: "purple",
  },
  { label: "New", value: "New", statusColor: "#5D3F96", btnClass: "purple" },
  {
    label: "Application",
    value: "Application",
    statusColor: "#5D3F96",
    btnClass: "purple",
  },
  {
    label: "Reply",
    value: "Reply",
    statusColor: "#109CF1",
    btnClass: "blue-btn",
  },
  {
    label: "in-the-kitchen",
    value: "In the Kitchen",
    statusColor: "#109CF1",
    btnClass: "in-kitchen-btn",
  },
  {
    label: "In the Kitchen",
    value: "In the Kitchen",
    statusColor: "#109CF1",
    btnClass: "in-kitchen-btn",
  },

  {
    label: "Job Done",
    value: "Job Done",
    statusColor: "#90A8BE",
    btnClass: "gray-btn",
  },
  {
    label: "Unpaid",
    value: "Unpaid",
    statusColor: "#F7685B",
    btnClass: "cancel-btn",
  },
  {
    label: "Expired",
    value: "Expired",
    statusColor: "#F7685B",
    btnClass: "cancel-btn",
  },
  {
    label: "Inactive",
    value: "Inactive",
    statusColor: "#F7685B",
    btnClass: "cancel-btn",
  },
  {
    label: "Cancel",
    value: "Cancel",
    statusColor: "#F7685B",
    btnClass: "cancel-btn",
  },
  {
    label: "Cancelled",
    value: "Cancel",
    statusColor: "#F7685B",
    btnClass: "cancel-btn",
  },
  {
    label: "Decline",
    value: "Decline",
    statusColor: "#F7685B",
    btnClass: "cancel-btn",
  },
  /** Below status got from Admin > Beauty Booking List*/
  {
    label: "Accepted-Paid",
    value: "Accepted-Paid",
    statusColor: "#2ED47A",
    btnClass: "success-btn",
  },
  {
    label: "Accepted",
    value: "Accepted",
    statusColor: "#2ED47A",
    btnClass: "success-btn",
  },
  {
    label: "cancelled",
    value: "Cancelled",
    statusColor: "#F7685B",
    btnClass: "declined-btn",
  },
  {
    label: "Disputed",
    value: "Disputed",
    statusColor: "#F7685B",
    btnClass: "cancel-btn",
  },
  {
    label: "Appointment",
    value: "Appointment",
    statusColor: "#F7685B",
    btnClass: "blue-btn",
  },
  {
    label: "Amount-Paid-Pending",
    value: "Amount-Paid-Pending",
    statusColor: "#FFC468",
    btnClass: "pending-btn",
  },
  {
    label: "QuoteSent",
    value: "Quote Sent",
    statusColor: "#FFC468",
    btnClass: "quote-btn",
  },
  {
    label: "Response",
    value: "Response",
    statusColor: "#2ED47A",
    btnClass: "success-btn",
  },
  {
    label: "Declined",
    value: "Declined",
    statusColor: "#F7685B",
    btnClass: "cancel-btn",
  },
  {
    label: "Rejected",
    value: "Rejected",
    statusColor: "#F7685B",
    btnClass: "cancel-btn",
  },
  {
    label: "Confirmed",
    value: "Confirmed",
    statusColor: "#2ED47A",
    btnClass: "success-btn",
  },
  {
    label: "QuoteSent",
    value: "Quote Sent",
    statusColor: "#FFC468",
    btnClass: "quote-btn",
  },
  {
    label: "Booking-Done",
    value: "Booking-Done",
    statusColor: "#2ED47A",
    btnClass: "success-btn",
  },
];

export const getStatusColor = (status) => {
  // const filteredOrderStatus = STATUS_WITH_COLOR.filter(
  //   (el) => el.label === status
  // );
  console.log(status, "status");
  const filteredOrderStatus = STATUS_WITH_COLOR.filter(
    (el) => el.label === status
  );
  console.log(filteredOrderStatus, "filteredorderstatus");
  return filteredOrderStatus.length > 0
    ? filteredOrderStatus[0].btnClass
    : "gray-btn quote-btn";
};

export const checkBookingForFutureDate = (bookingDate, startTime, status) => {
  var bookingDateTime = moment(`${bookingDate} ${startTime}`);
  // Check booking date is future date and return Upcoming status
  let isFutureDateBooking = moment(bookingDateTime).isAfter(
    moment().format("YYYY-MM-DD HH:mm:ss")
  );
  if (isFutureDateBooking === true) {
    return "Upcoming";
  } else {
    return status;
  }
};

export const timestampToString = (date, time, suffix) => {
  let dateString = getDateFromHours(date, time);
  let diffTime = (new Date().getTime() - (dateString || 0)) / 1000;
  if (diffTime < 60) {
    diffTime = "Just now";
  } else if (diffTime > 60 && diffTime < 3600) {
    diffTime =
      Math.floor(diffTime / 60) +
      (Math.floor(diffTime / 60) > 1
        ? suffix
          ? " minutes"
          : "m"
        : suffix
        ? " minute"
        : "m") +
      (suffix ? " ago" : "");
  } else if (diffTime > 3600 && diffTime / 3600 < 24) {
    diffTime =
      Math.floor(diffTime / 3600) +
      (Math.floor(diffTime / 3600) > 1
        ? suffix
          ? " hours"
          : "h"
        : suffix
        ? " hour"
        : "h") +
      (suffix ? " ago" : "");
  } else if (diffTime > 86400 && diffTime / 86400 < 30) {
    diffTime =
      Math.floor(diffTime / 86400) +
      (Math.floor(diffTime / 86400) > 1
        ? suffix
          ? " days"
          : "d"
        : suffix
        ? " day"
        : "d") +
      (suffix ? " ago" : "");
  } else {
    diffTime = moment(dateString).format("MMM D, YYYY");
  }
  return diffTime;
};

export const getDateFromHours = (bookingDate, startTime) => {
  startTime = startTime.split(":");
  let now = new Date(bookingDate);
  let dateTimeSting = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    ...startTime
  );
  return dateTimeSting;
};

export const colourNameToHex = (colour) => {
  var colours = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    gold: "#ffd700",
    goldenrod: "#daa520",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    "indianred ": "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavender: "#e6e6fa",
    lavenderblush: "#fff0f5",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgrey: "#d3d3d3",
    lightgreen: "#90ee90",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370d8",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#d87093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32",
  };

  if (typeof colours[colour.toLowerCase()] != "undefined")
    return colours[colour.toLowerCase()];

  return false;
};
