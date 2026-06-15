import type { Country } from '../../types';
import CountryCard from '../country-card/country-card';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';
import { memo, useMemo } from 'react';
import { List, type RowComponentProps } from 'react-window';

import styles from './country-list.module.css';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
};

type CountryRowProps = {
  countries: Country[];
  selectedYear: number;
  selectedColumns: string[];
};

function CountryRow({ index, style, ariaAttributes, countries, selectedYear, selectedColumns }: RowComponentProps<CountryRowProps>) {
  const country = countries[index];

  if (!country) {
    return null;
  }

  return (
    <div style={style} {...ariaAttributes}>
      <CountryCard
        country={country}
        selectedYear={selectedYear}
        selectedColumns={selectedColumns}
      />
    </div>
  );
}

const CountryList = memo(function CountryList({
  countries,
  searchQuery,
  selectedColumns,
  selectedRegion,
  selectedYear,
  sortField,
  sortOrder,
}: CountryListProps) {
  const filteredCountries = useMemo(() => {
    const filtered = countries
      .filter((c) => {
        const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion = !selectedRegion || c.data.some((d) => d.region === selectedRegion);
        return matchesSearch && matchesRegion;
      })
      .sort((a, b) => {
        if (sortField === 'name') {
          return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
        }

        const popA = getPopulationForYear(createYearDataMap(a.data), selectedYear) || 0;
        const popB = getPopulationForYear(createYearDataMap(b.data), selectedYear) || 0;
        return sortOrder === 'asc' ? popA - popB : popB - popA;
      });

    return filtered;
  }, [countries, searchQuery, selectedRegion, sortField, sortOrder, selectedYear]);

  return (
    <div className={styles.countryList}>
      <List
        style={{ width: '100%', height: Math.min(filteredCountries.length * 320, 720) }}
        rowCount={filteredCountries.length}
        rowHeight={(_, rowProps) => 120 + rowProps.selectedColumns.length * 34}
        rowComponent={CountryRow}
        rowProps={{
          countries: filteredCountries,
          selectedYear,
          selectedColumns,
        }}
        overscanCount={4}
      />
    </div>
  );
});

export default CountryList;
