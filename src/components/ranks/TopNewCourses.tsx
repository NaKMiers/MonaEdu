import { ICourse } from '@/models/CourseModel';
import React from 'react';
import CourseCard from '../CourseCard';
import Heading from '../Heading';
import Divider from '../Divider';

interface TopNewCoursesProps {
  courses: ICourse[];
  className?: string;
}

function TopNewCourses({ courses, className = '' }: TopNewCoursesProps) {
  return (
    <div className={`px-21 ${className}`}>
      <Heading title='Khóa học mới' />

      <Divider size={16} />

      <div className='max-w-1200 mx-auto'>
        <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 md:mx-0 flex-1 mb-8'>
          {courses.map((course) => (
            <CourseCard course={course} key={course._id} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopNewCourses;
