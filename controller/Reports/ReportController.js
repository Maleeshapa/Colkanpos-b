const { Op } = require("sequelize");
const Invoice = require("../../model/Invoice");
const InvoiceProduct = require("../../model/InvoiceProduct");
const Product = require("../../model/Products");
const ReturnProduct = require("../../model/ReturnProduct");
const sequelize = require("sequelize");

async function getReports(req, res) {
  try {
    const report = {
      lifetimeRevenue: await lifetimeRevenue(),
      revenueToday: await revenueToday(),
      revenueYesterday: await revenueYesterday(),
      revenueWeek: await revenueWeek(),
      revenueLastMonth: await revenueLastMonth(),
      revenueMonth: await revenueMonth(),
      monthlyRevenue: await monthlyRevenue(),

      lifetimeSales: await lifetimeSales(),
      salesToday: await salesToday(),
      salesYesterday: await salesYesterday(),
      salesWeek: await salesWeek(),
      salesLastMonth: await salesLastMonth(),
      salesMonth: await salesMonth(),
      mostSellingItemsWeek: await mostSellingItemsWeek(),
      mostSellingItemsMonth: await mostSellingItemsMonth(),
      monthlySales: await monthlySales(),
    };

    res.json({ message_type: "success", message: report });
  } catch (error) {
    console.error("Error while fetching reports:", error);
    res.status(500).json({ message_type: "error", message: error.message });
  }
}

// Utility function to calculate return amounts
async function getReturnsSum(dateFilter = {}) {
  const returnSum = await ReturnProduct.sum('returnAmount', {
    where: dateFilter,
  });
  return returnSum || 0;
}

// Lifetime Revenue
async function lifetimeRevenue() {
  const totalRevenue = await InvoiceProduct.sum('totalAmount');
  const totalReturns = await getReturnsSum();
  return (totalRevenue || 0) - totalReturns;
}

// Today's Revenue
async function revenueToday() {
  const today = new Date();
  const dateFilter = {
    invoiceDate: {
      [Op.gte]: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      [Op.lt]: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
    },
  };

  const totalRevenue = await InvoiceProduct.sum('totalAmount', {
    include: [{
      model: Invoice,
      as: 'invoice',
      attributes: [],
      where: dateFilter,
    }],
  });

  const totalReturns = await getReturnsSum({
    returnDate: dateFilter.invoiceDate,
  });

  return (totalRevenue || 0) - totalReturns;
}

// Yesterday's Revenue
async function revenueYesterday() {
  const today = new Date();
  const yesterdayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  const yesterdayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const dateFilter = {
    invoiceDate: {
      [Op.gte]: yesterdayStart,
      [Op.lt]: yesterdayEnd,
    },
  };

  const totalRevenue = await InvoiceProduct.sum('totalAmount', {
    include: [{
      model: Invoice,
      as: 'invoice',
      attributes: [],
      where: dateFilter,
    }],
  });

  const totalReturns = await getReturnsSum({
    returnDate: dateFilter.invoiceDate,
  });

  return (totalRevenue || 0) - totalReturns;
}

// Weekly Revenue
async function revenueWeek() {
  const today = new Date();
  const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const dateFilter = {
    invoiceDate: {
      [Op.gte]: last7Days,
      [Op.lt]: today,
    },
  };

  const totalRevenue = await InvoiceProduct.sum('totalAmount', {
    include: [{
      model: Invoice,
      as: 'invoice',
      attributes: [],
      where: dateFilter,
    }],
  });

  const totalReturns = await getReturnsSum({
    returnDate: dateFilter.invoiceDate,
  });

  return (totalRevenue || 0) - totalReturns;
}

// Monthly Revenue
async function revenueMonth() {
  const today = new Date();
  const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const dateFilter = {
    invoiceDate: {
      [Op.gte]: last30Days,
      [Op.lt]: today,
    },
  };

  const totalRevenue = await InvoiceProduct.sum('totalAmount', {
    include: [{
      model: Invoice,
      as: 'invoice',
      attributes: [],
      where: dateFilter,
    }],
  });

  const totalReturns = await getReturnsSum({
    returnDate: dateFilter.invoiceDate,
  });

  return (totalRevenue || 0) - totalReturns;
}

// Last Month's Revenue
async function revenueLastMonth() {
  const today = new Date();
  const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  const dateFilter = {
    invoiceDate: {
      [Op.gte]: startOfLastMonth,
      [Op.lt]: startOfCurrentMonth,
    },
  };

  const totalRevenue = await InvoiceProduct.sum('totalAmount', {
    include: [{
      model: Invoice,
      as: 'invoice',
      attributes: [],
      where: dateFilter,
    }],
  });

  const totalReturns = await getReturnsSum({
    returnDate: dateFilter.invoiceDate,
  });

  return (totalRevenue || 0) - totalReturns;
}

// Month-wise Revenue for the Last 12 Months
async function monthlyRevenue() {
  const today = new Date();
  const result = [];

  for (let i = 0; i < 12; i++) {
    const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);

    const dateFilter = {
      invoiceDate: {
        [Op.gte]: monthStart,
        [Op.lt]: monthEnd,
      },
    };

    const revenue = await InvoiceProduct.sum('totalAmount', {
      include: [{
        model: Invoice,
        as: 'invoice',
        attributes: [],
        where: dateFilter,
      }],
    });

    const returns = await getReturnsSum({
      returnDate: dateFilter.invoiceDate,
    });

    result.push({
      month: monthStart.toLocaleString('default', { month: 'long' }),
      year: monthStart.getFullYear(),
      revenue: (revenue || 0) - returns,
    });
  }

  return result.reverse();
}

// Month-wise Sales for the Last 12 Months
async function monthlySales() {
  const today = new Date();
  const result = [];

  for (let i = 0; i < 12; i++) {
    const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);

    const sales = await Invoice.count({
      where: {
        invoiceDate: {
          [Op.gte]: monthStart,
          [Op.lt]: monthEnd,
        },
      },
    });

    result.push({
      month: monthStart.toLocaleString('default', { month: 'long' }),
      year: monthStart.getFullYear(),
      sales: sales || 0,
    });
  }

  return result.reverse();
}


// Lifetime Sales
async function lifetimeSales() {
  const result = await Invoice.count();
  return result || 0;
}
// Today's Sales
async function salesToday() {
  const today = new Date();
  const result = await Invoice.count({
    where: {
      invoiceDate: {
        [Op.gte]: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        [Op.lt]: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      },
    },
  });
  return result || 0;
}
// Yesterday's Sales
async function salesYesterday() {
  const today = new Date();
  const yesterdayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  const yesterdayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const result = await Invoice.count({
    where: {
      invoiceDate: {
        [Op.gte]: yesterdayStart,
        [Op.lt]: yesterdayEnd,
      },
    },
  });

  return result || 0;
}
// Weekly Sales
async function salesWeek() {
  const today = new Date();
  const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const result = await Invoice.count({
    where: {
      invoiceDate: {
        [Op.gte]: last7Days,
        [Op.lt]: today,
      },
    },
  });
  return result || 0;
}
// Monthly Sales
async function salesMonth() {
  const today = new Date();
  const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const result = await Invoice.count({
    where: {
      invoiceDate: {
        [Op.gte]: last30Days,
        [Op.lt]: today,
      },
    },
  });
  return result || 0;
}
// Last Month's Sales
async function salesLastMonth() {
  const today = new Date();
  const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  const result = await Invoice.count({
    where: {
      invoiceDate: {
        [Op.gte]: startOfLastMonth,
        [Op.lt]: startOfCurrentMonth,
      },
    },
  });

  return result || 0;
}
// Most Selling Items for the Week
async function mostSellingItemsWeek() {
  const today = new Date();
  const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const result = await InvoiceProduct.findAll({
    attributes: [
      [sequelize.col('product.productName'), 'productName'],
      [sequelize.fn('SUM', sequelize.col('invoiceQty')), 'totalQuantity']
    ],
    include: [{
      model: Product,
      as: 'product',
      attributes: []
    }, {
      model: Invoice,
      as: 'invoice',
      attributes: [],
      where: {
        invoiceDate: {
          [Op.gte]: last7Days,
          [Op.lt]: today,
        },
      },
    }],
    group: ['product.productId'],
    order: [[sequelize.fn('SUM', sequelize.col('invoiceQty')), 'DESC']],
    limit: 5,
    raw: true
  });

  return result;
}

// Most Selling Items for the Month
async function mostSellingItemsMonth() {
  const today = new Date();
  const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const result = await InvoiceProduct.findAll({
    attributes: [
      [sequelize.col('product.productName'), 'productName'],
      [sequelize.fn('SUM', sequelize.col('invoiceQty')), 'totalQuantity']
    ],
    include: [{
      model: Product,
      as: 'product',
      attributes: []
    }, {
      model: Invoice,
      as: 'invoice',
      attributes: [],
      where: {
        invoiceDate: {
          [Op.gte]: last30Days,
          [Op.lt]: today,
        },
      },
    }],
    group: ['product.productId'],
    order: [[sequelize.fn('SUM', sequelize.col('invoiceQty')), 'DESC']],
    limit: 5,
    raw: true
  });

  return result;
}
// Month-wise Sales for the Last 12 Months
async function monthlySales() {
  const today = new Date();
  const result = [];

  for (let i = 0; i < 12; i++) {
    const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);

    const sales = await Invoice.count({
      where: {
        invoiceDate: {
          [Op.gte]: monthStart,
          [Op.lt]: monthEnd,
        },
      },
    });

    result.push({
      month: monthStart.toLocaleString('default', { month: 'long' }),
      year: monthStart.getFullYear(),
      sales: sales || 0,
    });
  }

  return result.reverse();
}

module.exports = {
  getReports,
};