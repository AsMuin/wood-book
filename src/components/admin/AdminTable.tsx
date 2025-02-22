import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState, type ReactNode } from 'react';
import { IResponse, TableColumns } from '../../../types';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/useToast';

interface AdminTableProps<T extends Record<string, any>> {
    title: ReactNode;
    query: (limit: number, pageIndex: number) => Promise<IResponse<T[]>>;
    // data: T[];
    columns: Partial<TableColumns<T>>;
    operations?: (rowData: T) => ReactNode;
}

function AdminTable<T extends Record<string, any>>({ columns, title, operations, query }: AdminTableProps<T>) {
    const [data, setData] = useState<T[]>([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(false);
    const renderColumns = Object.entries(columns).map(([key, column]) => ({
        key,
        ...column
    }));

    useEffect(() => {
        setLoading(true);
        query(10, pageIndex)
            .then(result => {
                if (result.success) {
                    setData(result.data);
                    setTotal(result.total || 0);
                } else {
                    toast({
                        title: '失败',
                        description: result.message,
                        variant: 'destructive'
                    });
                }
            })
            .catch((error: Error) => {
                toast({
                    title: '失败',
                    description: error instanceof Error ? error.message : '查询失败',
                    variant: 'destructive'
                });
            })
            .finally(() => setLoading(false));
    }, [pageIndex, query]);

    return (
        <>
            <h3 className="mb-2 border-b-2 pb-2 font-bebas-neue text-3xl">{title}</h3>
            <Table>
                {/* <TableCaption>{title}</TableCaption> */}
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
                {/* <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell className="text-right">$2,500.00</TableCell>
                    </TableRow>
                </TableFooter> */}
            </Table>
            <AdminTable.Pagination pageIndex={pageIndex} setPageIndex={setPageIndex} limit={10} total={total} />
        </>
    );
}

interface OperationsProps {
    children?: ReactNode;
}

AdminTable.Operations = function AdminTableOperations({ children }: OperationsProps) {
    return children;
};

interface PaginationProps {
    pageIndex: number;
    limit: number;
    total: number;
    setPageIndex: (pageIndex: number) => void;
}

AdminTable.Pagination = function AdminTablePagination({ pageIndex, limit, total, setPageIndex }: PaginationProps) {
    const pageCount = Math.ceil(total / limit) || 1;

    function prevPageIndex() {
        if (pageIndex > 0) {
            setPageIndex(pageIndex - 1);
        }
    }

    function nextPageIndex() {
        if (pageIndex + 1 < pageCount) {
            setPageIndex(pageIndex + 1);
        }
    }

    return (
        <Pagination className={cn('mt-4 flex justify-end pr-8')}>
            <PaginationContent>
                <PaginationPrevious onClick={prevPageIndex} />
                {Array.from({ length: pageCount }).map((_, i) => (
                    <PaginationItem key={i}>
                        <PaginationLink className={cn(pageIndex === i && 'bg-slate-100 text-light-200')} onClick={() => setPageIndex(i)}>
                            {i + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationNext onClick={nextPageIndex} />
            </PaginationContent>
        </Pagination>
    );
};

export default AdminTable;
