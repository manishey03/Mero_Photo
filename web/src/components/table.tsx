// src/components/Table.tsx
import React from "react";

interface TableProps<T extends object> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T;
    render?: (item: T) => React.ReactNode;
  }[];
  onRowClick?: (item: T) => void;
}

const Table = <T extends object>({
  data,
  columns,
  onRowClick,
}: TableProps<T>) => {
  // Add extends {} here
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor.toString()}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data &&
            data.length &&
            data.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((column) => (
                  <td
                    key={`${index}-${column.accessor.toString()}`}
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    {column.render
                      ? column.render(item)
                      : item[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
