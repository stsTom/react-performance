import { memo } from "react"
import { SearchBar } from "../search-bar/search-bar"
import { YearSelector } from "../year-selector/year-selector"

import styles from './controls.module.css'

interface ControlsProps {
  searchQuery: string;
  handleSearch: (value: string) => void;
  selectedYear: number;
  years: number[];
  handleYearChange: (year: number) => void;
  sortField: 'name' | 'population';
  handleSortFieldChange: (field: 'name' | 'population') => void;
  handleSortOrderToggle: () => void;
  sortOrder: 'asc' | 'desc';
  handleModalToggle: () => void;
  selectedColumns: string[];
}

const Controls = memo(function Controls({
  searchQuery,
  handleSearch,
  selectedYear,
  years,
  handleYearChange,
  sortField,
  handleSortFieldChange,
  handleSortOrderToggle,
  sortOrder,
  handleModalToggle,
  selectedColumns
}: ControlsProps){
  return(
    <div className={styles.controls}>
        <SearchBar value={searchQuery} onChange={handleSearch} />
        <YearSelector year={selectedYear} years={years} onChange={handleYearChange} />

        <div className={styles.sortContainer}>
          <label className={styles.sortLabel}>Sort by:</label>
          <select
            value={sortField}
            onChange={(e) => handleSortFieldChange(e.target.value as 'name' | 'population')}
            className={styles.sortSelect}
          >
            <option value="population">Population</option>
            <option value="name">Name</option>
          </select>

          <button onClick={handleSortOrderToggle} className={styles.sortButton}>
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>

        <div className={styles.columnButtonContainer}>
          <button onClick={handleModalToggle} className={styles.columnButton}>
            Select columns ({selectedColumns.length} selected)
          </button>
        </div>
      </div>
  )
})

export default Controls