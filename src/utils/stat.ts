import { ICategory } from '@/models/CategoryModel'
import moment from 'moment'

// MARK: Revenue
const calculateRevenue = (orders: any[], date: Date | string, interval: string) => {
  const startOfInterval = moment(date).startOf(interval as moment.unitOfTime.StartOf)
  const endOfInterval = moment(date).endOf(interval as moment.unitOfTime.StartOf)

  const filteredOrders = orders.filter(order =>
    moment(order.createdAt).isBetween(startOfInterval, endOfInterval, undefined, '[]')
  )

  const revenue = filteredOrders.reduce((total, order) => total + order.total, 0)
  return revenue
}

export const revenueStatCalc = (orders: any) => {
  const currentDate = moment()

  // prev day, month, year
  const lastDay = moment(currentDate).subtract(1, 'days')
  const lastMonth = moment(currentDate).subtract(1, 'months')
  const lastYear = moment(currentDate).subtract(1, 'years')

  // revenues
  const revenueToday = calculateRevenue(orders, currentDate.toDate(), 'day')
  const revenueYesterday = calculateRevenue(orders, lastDay.toDate(), 'day')
  const revenueThisMonth = calculateRevenue(orders, currentDate.toDate(), 'month')
  const revenueLastMonth = calculateRevenue(orders, lastMonth.toDate(), 'month')
  const revenueThisYear = calculateRevenue(orders, currentDate.toDate(), 'year')
  const revenueLastYear = calculateRevenue(orders, lastYear.toDate(), 'year')

  // build revenue stat
  const revenueStat = {
    day: [
      revenueToday,
      revenueYesterday,
      (((revenueToday - revenueYesterday) / revenueYesterday) * 100 || 0).toFixed(2),
    ],
    month: [
      revenueThisMonth,
      revenueLastMonth,
      (((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100 || 0).toFixed(2),
    ],
    year: [
      revenueThisYear,
      revenueLastYear,
      (((revenueThisYear - revenueLastYear) / revenueLastYear) * 100 || 0).toFixed(2),
    ],
  }

  return revenueStat
}

// MARK: New Order
const calculateNewOrders = (orders: any[], startDate: Date | string, endDate: Date | string) => {
  const filteredOrders = orders.filter(order =>
    moment(order.createdAt).isBetween(startDate, endDate, undefined, '[]')
  )

  return filteredOrders.length
}

export const newOrderStatCalc = (orders: any[]) => {
  const currentDate = moment()

  // prev day, month, year
  const lastDay = moment(currentDate).subtract(1, 'days')
  const lastMonth = moment(currentDate).subtract(1, 'months')
  const lastYear = moment(currentDate).subtract(1, 'years')

  // new orders
  const newOrdersToday = calculateNewOrders(
    orders,
    currentDate.startOf('day').toDate(),
    currentDate.endOf('day').toDate()
  )
  const newOrdersYesterday = calculateNewOrders(
    orders,
    lastDay.startOf('day').toDate(),
    lastDay.endOf('day').toDate()
  )
  const newOrdersThisMonth = calculateNewOrders(
    orders,
    currentDate.startOf('month').toDate(),
    currentDate.endOf('month').toDate()
  )
  const newOrdersLastMonth = calculateNewOrders(
    orders,
    lastMonth.startOf('month').toDate(),
    lastMonth.endOf('month').toDate()
  )
  const newOrdersThisYear = calculateNewOrders(
    orders,
    currentDate.startOf('year').toDate(),
    currentDate.endOf('year').toDate()
  )
  const newOrdersLastYear = calculateNewOrders(
    orders,
    lastYear.startOf('year').toDate(),
    lastYear.endOf('year').toDate()
  )

  // build new order stat
  const newOrderStat = {
    day: [
      newOrdersToday,
      newOrdersYesterday,
      (((newOrdersToday - newOrdersYesterday) / newOrdersYesterday) * 100 || 0).toFixed(2),
    ],
    month: [
      newOrdersThisMonth,
      newOrdersLastMonth,
      (((newOrdersThisMonth - newOrdersLastMonth) / newOrdersLastMonth) * 100 || 0).toFixed(2),
    ],
    year: [
      newOrdersThisYear,
      newOrdersLastYear,
      (((newOrdersThisYear - newOrdersLastYear) / newOrdersLastYear) * 100 || 0).toFixed(2),
    ],
  }

  return newOrderStat
}

// MARK: New User
const calculateNewUsers = (orders: any[], startDate: Date | string, endDate: Date | string) => {
  let newUserEmails: string[] = []
  orders.forEach(order => {
    if (moment(order.createdAt).isBetween(startDate, endDate, undefined, '[]')) {
      const email = order.email
      if (!newUserEmails.includes(email)) {
        newUserEmails.push(email)
      }
    }
  })
  return newUserEmails.length
}

export const newUserStatCalc = (users: any[]) => {
  const currentDate = moment()

  // prev day, month, year
  const lastDay = moment(currentDate).subtract(1, 'days')
  const lastMonth = moment(currentDate).subtract(1, 'months')
  const lastYear = moment(currentDate).subtract(1, 'years')

  // new users
  const newUsersToday = calculateNewUsers(
    users,
    currentDate.startOf('day').toDate(),
    currentDate.endOf('day').toDate()
  )
  const newUsersYesterday = calculateNewUsers(
    users,
    lastDay.startOf('day').toDate(),
    lastDay.endOf('day').toDate()
  )
  const newUsersThisMonth = calculateNewUsers(
    users,
    currentDate.startOf('month').toDate(),
    currentDate.endOf('month').toDate()
  )
  const newUsersLastMonth = calculateNewUsers(
    users,
    lastMonth.startOf('month').toDate(),
    lastMonth.endOf('month').toDate()
  )
  const newUsersThisYear = calculateNewUsers(
    users,
    currentDate.startOf('year').toDate(),
    currentDate.endOf('year').toDate()
  )
  const newUsersLastYear = calculateNewUsers(
    users,
    lastYear.startOf('year').toDate(),
    lastYear.endOf('year').toDate()
  )

  // build new user stat
  const newUserStat = {
    day: [
      newUsersToday,
      newUsersYesterday,
      (((newUsersToday - newUsersYesterday) / newUsersYesterday) * 100 || 0).toFixed(2),
    ],
    month: [
      newUsersThisMonth,
      newUsersLastMonth,
      (((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100 || 0).toFixed(2),
    ],
    year: [
      newUsersThisYear,
      newUsersLastYear,
      (((newUsersThisYear - newUsersLastYear) / newUsersLastYear) * 100 || 0).toFixed(2),
    ],
  }

  return newUserStat
}

// MARK: New Courses Sold
const calculateNewCoursesSold = (orders: any[], startDate: Date | string, endDate: Date | string) => {
  let newCourses = 0
  orders.forEach(order => {
    if (moment(order.createdAt).isBetween(startDate, endDate, undefined, '[]')) {
      newCourses = order.items.length
    }
  })
  return newCourses
}

export const newCoursesSoldStatCalc = (orders: any[]) => {
  const currentDate = moment()

  // prev day, month, year
  const lastDay = moment(currentDate).subtract(1, 'days')
  const lastMonth = moment(currentDate).subtract(1, 'months')
  const lastYear = moment(currentDate).subtract(1, 'years')

  // new accounts sold
  const newCoursesSoldToday = calculateNewCoursesSold(
    orders,
    currentDate.startOf('day').toDate(),
    currentDate.endOf('day').toDate()
  )
  const newCoursesSoldYesterday = calculateNewCoursesSold(
    orders,
    lastDay.startOf('day').toDate(),
    lastDay.endOf('day').toDate()
  )
  const newCoursesSoldThisMonth = calculateNewCoursesSold(
    orders,
    currentDate.startOf('month').toDate(),
    currentDate.endOf('month').toDate()
  )
  const newCoursesSoldLastMonth = calculateNewCoursesSold(
    orders,
    lastMonth.startOf('month').toDate(),
    lastMonth.endOf('month').toDate()
  )
  const newCoursesSoldThisYear = calculateNewCoursesSold(
    orders,
    currentDate.startOf('year').toDate(),
    currentDate.endOf('year').toDate()
  )
  const newCoursesSoldLastYear = calculateNewCoursesSold(
    orders,
    lastYear.startOf('year').toDate(),
    lastYear.endOf('year').toDate()
  )

  // build new account sold stat
  const newCoursesSoldStat = {
    day: [
      newCoursesSoldToday,
      newCoursesSoldYesterday,
      (((newCoursesSoldToday - newCoursesSoldYesterday) / newCoursesSoldYesterday) * 100 || 0).toFixed(
        2
      ),
    ],
    month: [
      newCoursesSoldThisMonth,
      newCoursesSoldLastMonth,
      (
        ((newCoursesSoldThisMonth - newCoursesSoldLastMonth) / newCoursesSoldLastMonth) * 100 || 0
      ).toFixed(2),
    ],
    year: [
      newCoursesSoldThisYear,
      newCoursesSoldLastYear,
      (((newCoursesSoldThisYear - newCoursesSoldLastYear) / newCoursesSoldLastYear) * 100 || 0).toFixed(
        2
      ),
    ],
  }

  return newCoursesSoldStat
}

// MARK: Used Voucher
const calculateUsedVouchers = (orders: any[], startDate: Date | string, endDate: Date | string) => {
  let usedVouchers = 0
  orders.forEach(order => {
    if (moment(order.createdAt).isBetween(startDate, endDate, undefined, '[]')) {
      if (order.discount && order.discount !== 0) {
        usedVouchers++
      }
    }
  })
  return usedVouchers
}

export const newUsedVoucherStatCalc = (orders: any[]) => {
  const currentDate = moment()

  // prev day, month, year
  const lastDay = moment(currentDate).subtract(1, 'days')
  const lastMonth = moment(currentDate).subtract(1, 'months')
  const lastYear = moment(currentDate).subtract(1, 'years')

  // used vouchers
  const usedVouchersToday = calculateUsedVouchers(
    orders,
    currentDate.startOf('day').toDate(),
    currentDate.endOf('day').toDate()
  )
  const usedVouchersYesterday = calculateUsedVouchers(
    orders,
    lastDay.startOf('day').toDate(),
    lastDay.endOf('day').toDate()
  )
  const usedVouchersThisMonth = calculateUsedVouchers(
    orders,
    currentDate.startOf('month').toDate(),
    currentDate.endOf('month').toDate()
  )
  const usedVouchersLastMonth = calculateUsedVouchers(
    orders,
    lastMonth.startOf('month').toDate(),
    lastMonth.endOf('month').toDate()
  )
  const usedVouchersThisYear = calculateUsedVouchers(
    orders,
    currentDate.startOf('year').toDate(),
    currentDate.endOf('year').toDate()
  )
  const usedVouchersLastYear = calculateUsedVouchers(
    orders,
    lastYear.startOf('year').toDate(),
    lastYear.endOf('year').toDate()
  )

  // build used voucher stat
  const newUsedVoucherStat = {
    day: [
      usedVouchersToday,
      usedVouchersYesterday,
      (((usedVouchersToday - usedVouchersYesterday) / usedVouchersYesterday) * 100 || 0).toFixed(2),
    ],
    month: [
      usedVouchersThisMonth,
      usedVouchersLastMonth,
      (((usedVouchersThisMonth - usedVouchersLastMonth) / usedVouchersLastMonth) * 100 || 0).toFixed(2),
    ],
    year: [
      usedVouchersThisYear,
      usedVouchersLastYear,
      (((usedVouchersThisYear - usedVouchersLastYear) / usedVouchersLastYear) * 100 || 0).toFixed(2),
    ],
  }

  return newUsedVoucherStat
}

// MARK: Revenue By Course Rank
export const rankCourseRevenue = (orders: any[], categories: ICategory[]) => {
  const crs: any = []

  // export courses from orders
  orders.forEach(order => {
    const items: any[] = order.items
    const discount = order.discount || 0
    const quantity = items.length

    items.forEach(item => {
      let price = item.price
      const flashSale = item.flashSale

      if (flashSale) {
        switch (flashSale.type) {
          case 'fixed-reduce': {
            price = price + +flashSale.value >= 0 ? price + +flashSale.value : 0
            break
          }
          case 'fixed': {
            price = +flashSale.value
            break
          }
          case 'percentage': {
            price = price + Math.floor((price * parseFloat(flashSale.value)) / 100)
            break
          }
        }
      }

      price = price - discount / quantity

      crs.push(item)
    })
  })

  const categoryCoursesMap: { [key: string]: any[] } = {}
  crs.forEach((course: any) => {
    const slug: string = course.category.slug

    if (!categoryCoursesMap[slug]) {
      categoryCoursesMap[slug] = [course]
    } else {
      categoryCoursesMap[slug].push(course)
    }
  })

  const groupCoursesByEmail = (categoryCoursesMap: { [key: string]: any[] }) => {
    const groupedCoursesByEmail: { [key: string]: { [key: string]: any[] } } = {}

    for (const category in categoryCoursesMap) {
      if (categoryCoursesMap.hasOwnProperty(category)) {
        const courses = categoryCoursesMap[category]

        const groupedByEmail: { [key: string]: any[] } = {}

        courses.forEach((course, index) => {
          const emailMatch = course.info.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)

          if (emailMatch) {
            const email = emailMatch[0]

            if (!groupedByEmail[email]) {
              groupedByEmail[email] = [course]
            } else {
              groupedByEmail[email].push(course)
            }
          }
        })

        groupedCoursesByEmail[category] = groupedByEmail
      }
    }

    return groupedCoursesByEmail
  }

  // group courses by email
  const groupedCoursesByEmail = groupCoursesByEmail(categoryCoursesMap)

  const courses = Object.entries(groupedCoursesByEmail).map(([_, courseByEmailGroups]) => {
    return Object.entries(courseByEmailGroups)
      .map(([email, courses]) => {
        const totalRevenue = courses.reduce((total, course) => total + course.price, 0)
        return {
          email,
          category: courses[0].category,
          revenue: totalRevenue.toFixed(2),
        }
      })
      .sort((a, b) => b.revenue - a.revenue)
  })

  return courses.flat()
}
