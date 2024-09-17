import { FaBlog, FaTicketAlt } from 'react-icons/fa'
import { FaBoltLightning, FaListCheck, FaTags, FaUser } from 'react-icons/fa6'
import { MdCategory, MdReportOff, MdSpaceDashboard } from 'react-icons/md'
import { RiBillFill, RiVipCrown2Fill } from 'react-icons/ri'
import { SiCoursera } from 'react-icons/si'

// MARK: Admin Links
export const adminLinks = [
  {
    title: 'Dashboard',
    Icon: MdSpaceDashboard,
    links: [
      {
        title: 'Dashboard',
        href: '/admin',
      },
    ],
  },
  {
    title: 'Order',
    Icon: RiBillFill,
    links: [
      {
        title: 'All Orders',
        href: '/admin/order/all',
      },
    ],
  },
  {
    title: 'Course',
    Icon: SiCoursera,
    links: [
      {
        title: 'All Courses',
        href: '/admin/course/all',
      },
      {
        title: 'Add Course',
        href: '/admin/course/add',
      },
    ],
  },
  {
    title: 'User',
    Icon: FaUser,
    links: [
      {
        title: 'All Users',
        href: '/admin/user/all',
      },
    ],
  },
  {
    title: 'Summary',
    Icon: FaListCheck,
    links: [
      {
        title: 'All Summaries',
        href: '/admin/summary/all',
      },
    ],
  },

  {
    title: 'Tag',
    Icon: FaTags,
    links: [
      {
        title: 'All Tags',
        href: '/admin/tag/all',
      },
      {
        title: 'Add Tag',
        href: '/admin/tag/add',
      },
    ],
  },
  {
    title: 'Category',
    Icon: MdCategory,
    links: [
      {
        title: 'All Categories',
        href: '/admin/category/all',
      },
    ],
  },
  {
    title: 'Voucher',
    Icon: FaTicketAlt,
    links: [
      {
        title: 'All Vouchers',
        href: '/admin/voucher/all',
      },
      {
        title: 'Add Voucher',
        href: '/admin/voucher/add',
      },
    ],
  },
  {
    title: 'Flash Sale',
    Icon: FaBoltLightning,
    links: [
      {
        title: 'All Flash Sales',
        href: '/admin/flash-sale/all',
      },
      {
        title: 'Add Flash Sale',
        href: '/admin/flash-sale/add',
      },
    ],
  },
  {
    title: 'Packages',
    Icon: RiVipCrown2Fill,
    links: [
      {
        title: 'Packages',
        href: '/admin/package/all',
      },
    ],
  },
  {
    title: 'Blog',
    Icon: FaBlog,
    links: [
      {
        title: 'All Blogs',
        href: '/admin/blog/all',
      },
      {
        title: 'Add Blog',
        href: '/admin/blog/add',
      },
    ],
  },
  {
    title: 'Report',
    Icon: MdReportOff,
    links: [
      {
        title: 'All Reports',
        href: '/admin/report/all',
      },
    ],
  },
]

// MARK: Admin List
export const admins = {
  KHOA: {
    momo: {
      account: '0899320427',
      receiver: 'Nguyễn Anh Khoa',
      link: 'https://me.momo.vn/anphashop',
      image: '/images/momo-qr.jpg',
    },
    banking: {
      name: 'Vietcombank',
      account: '1040587211',
      receiver: 'Nguyễn Anh Khoa',
      image: '/images/banking-qr.jpg',
    },
    zalo: 'https://zalo.me/0899320427',
    messenger: 'https://www.messenger.com/t/170660996137305',
  },
}

// MARK: Report Contents
export const reportContents = {
  comment: [
    'Bạo lực',
    '18+',
    'Spam',
    'Giả mạo',
    'Trùng lặp',
    'Xúc phạm',
    'Quấy rối',
    'Phát ngôn thù hận',
  ],
  lesson: [
    'Bạo lực',
    '18+',
    'Spam',
    'Giả mạo',
    'Trùng lặp',
    'Xúc phạm',
    'Quấy rối',
    'Phát ngôn thù hận',
    'Thông tin sai lệch',
  ],
  course: [
    'Bạo lực',
    '18+',
    'Spam',
    'Giả mạo',
    'Trùng lặp',
    'Xúc phạm',
    'Quấy rối',
    'Phát ngôn thù hận',
    'Thông tin sai lệch',
  ],
}
