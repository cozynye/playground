'use client';

import { TestCard } from './TestCard';
import type { ITest, TestCategory } from '../types';
import { useState } from 'react';

interface TestListProps {
  tests: ITest[];
}

const categories: { value: TestCategory | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'personality', label: '성격' },
  { value: 'love', label: '연애' },
  { value: 'psychology', label: '심리' },
  { value: 'fun', label: '재미' },
  { value: 'career', label: '진로' },
];

export function TestList({ tests }: TestListProps) {
  const [selectedCategory, setSelectedCategory] = useState<TestCategory | 'all'>('all');

  const filteredTests =
    selectedCategory === 'all'
      ? tests
      : tests.filter((test) => test.category === selectedCategory);

  return (
    <div className="w-full">
      {/* 카테고리 필터 */}
      <div className="mb-8 flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
              selectedCategory === category.value
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* 테스트 카드 그리드 */}
      {filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredTests.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">해당 카테고리의 테스트가 없습니다.</p>
        </div>
      )}

      {/* 테스트 개수 */}
      <div className="mt-10 text-center">
        <p className="text-gray-600 text-sm">
          총 <span className="font-bold text-purple-600">{filteredTests.length}</span>개의 테스트
        </p>
      </div>
    </div>
  );
}
