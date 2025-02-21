import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ReactNode } from 'react';
import { TableColumns } from '../../../types';

interface AdminTableProps<T extends Record<string, any>> {
    title: ReactNode;
    data: T[];
    columns: Partial<TableColumns<T>>;
    operations?: (rowData: T) => ReactNode;
}

function AdminTable<T extends Record<string, any>>({ data, columns, title, operations }: AdminTableProps<T>) {
    const renderColumns = Object.entries(columns).map(([key, column]) => ({
        key,
        ...column
    }));

    return (
        <>
            <h3 className="mb-2 border-b-2 pb-2 font-bebas-neue text-3xl">{title}</h3>
            <Table>
                <TableCaption>{title}</TableCaption>
                <TableHeader>
                    <TableRow>
                        {renderColumns.map(header => (
                            <TableHead key={header.key}>{header.header}</TableHead>
                        ))}
                        {operations && <TableHead>操作</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map(rowData => (
                        <TableRow key={rowData.invoice}>
                            {renderColumns.map(column => (
                                <TableCell key={column.key}>
                                    {column.render && typeof column.render === 'function'
                                        ? column.render(rowData[column.key], rowData)
                                        : rowData[column.key]}
                                </TableCell>
                            ))}
                            {operations && (
                                <TableCell>
                                    <AdminTable.Operations>{operations(rowData)}</AdminTable.Operations>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell className="text-right">$2,500.00</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </>
    );
}

interface OperationsProps {
    children?: ReactNode;
}

AdminTable.Operations = function AdminTableOperations({ children }: OperationsProps) {
    return children;
};

export default AdminTable;
