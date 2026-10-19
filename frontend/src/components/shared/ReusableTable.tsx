import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

type ReusableTableProps<T> = {
  columns: ColumnsType<T>;
  data: T[];
  rowKey?: string;
  loading?: boolean;
  rowSelection?: any;
  onRowClick?: (record: T) => void;
};

export default function ReusableTable<T extends object>({
  columns,
  data,
  rowKey = "id",
  loading = false,
  rowSelection,
  onRowClick,
}: ReusableTableProps<T>) {
    return(
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden w-full">
            <div className=" [&_.ant-table-thead_th]:text-slate-500
                             [&_.ant-table-thead_th]:text-[11px]
                             [&_.ant-table-thead_th]:font-semibold
                             [&_.ant-table-thead_th]:uppercase
                             [&_.ant-table-thead_th]:tracking-wider
                             [&_.ant-table-thead_th]:bg-[#F8FAFC] 
                             [&_.ant-table-thead_tr_th]:whitespace-nowrap 
                             [&_.ant-table-cell]:whitespace-nowrap
                             [&_.ant-table-cell]:text-xs
                             [&_.ant-table-cell]:py-2.5
            ">
              <Table
                columns={columns}
                dataSource={data}
                rowKey={rowKey}
                loading={loading}
                rowSelection={rowSelection}
                scroll={{ x: true }}
                style={{ width: "100%" }}
                pagination={{
                    pageSize: 15,
                    showTotal: (total, range) => `Showing ${range[0]}–${range[1]} of ${total} records`,
                    showSizeChanger: false,
                }}
                onRow={
                  onRowClick
                    ? (record) => ({
                        onClick: () => onRowClick(record),
                        className: 'cursor-pointer hover:bg-slate-50/80 transition-colors',
                      })
                    : undefined
                }
              />
            </div>
        </div>
    )
}
