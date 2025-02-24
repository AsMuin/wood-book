'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCallback, useEffect, useImperativeHandle, useState, type ReactNode } from 'react';
import { IResponse, TableColumns } from '../../../types';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/useToast';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';

interface AdminTableProps<T extends Record<string, any>> {
    title: ReactNode;
    query: (limit: number, pageIndex: number, signal?: AbortSignal) => Promise<IResponse<T[]>>;
    // data: T[];
    columns: Partial<TableColumns<T>>;
    operations?: (rowData: T) => ReactNode;
    limit?: number;
    ref?: React.RefObject<{ reQuery: () => Promise<void> } | null>;
}

interface TableModel<T extends Record<string, any>> {
    data: T[];
    total: number;
}

function AdminTable<T extends Record<string, any>>({ columns, title, operations, query, limit = 10, ref }: AdminTableProps<T>) {
    const [tableModel, setTableModel] = useState<TableModel<T>>({
        data: [],
        total: 0
    });
    const [pageIndex, setPageIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const renderColumns = Object.entries(columns).map(([key, column]) => ({
        key,
        ...column
    }));
    const onQuery = useCallback(
        async (pageIndex: number, limit: number, signal?: AbortSignal) => {
            setLoading(true);

            try {
                const result = await query(limit, pageIndex, signal);

                if (!result.success) {
                    throw new Error(result.message);
                } else {
                    setTableModel({
                        data: result.data,
                        total: result.total || 0
                    });
                }
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    toast({
                        title: '失败',
                        description: (error as Error).message,
                        variant: 'destructive'
                    });
                }
            }

            setLoading(false);
        },
        [query]
    );

    useImperativeHandle(ref, () => ({
        reQuery: (signal?: AbortSignal) => onQuery(pageIndex, limit, signal)
    }));

    useEffect(() => {
        const controller = new AbortController();

        onQuery(pageIndex, limit, controller.signal);

        return () => {
            controller.abort();
        };
    }, [onQuery, pageIndex, limit]);

    return (
        <>
            <div className="mb-2 flex justify-between border-b-2 px-4 pb-2 font-bebas-neue text-3xl">
                <h3>{title}</h3>
                <Button className="bg-light-100" disabled={loading} onClick={() => onQuery(pageIndex, limit)}>
                    查询
                </Button>
            </div>
            <Table>
                {/* <TableCaption>{title}</TableCaption> */}
                <TableHeader>
                    <TableRow>
                        {renderColumns.map(header => (
                            <TableHead key={header.key} className="border-r last:border-r-0">
                                {header.header}
                            </TableHead>
                        ))}
                        {operations && <TableHead>操作</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading
                        ? Array.from({ length: limit }).map((_, index) => (
                              <TableRow key={index}>
                                  {renderColumns.map(column => (
                                      <TableCell key={column.key}>
                                          <Skeleton className="h-8 bg-slate-200" />
                                      </TableCell>
                                  ))}
                                  {operations && (
                                      <TableCell>
                                          <Skeleton className="h-8 bg-slate-200" />
                                      </TableCell>
                                  )}
                              </TableRow>
                          ))
                        : tableModel.data.map((rowData, i) => (
                              <TableRow key={i}>
                                  {renderColumns.map(column => (
                                      <TableCell key={column.key} className="min-w-32 border-r last:border-r-0">
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
            <AdminTable.Pagination pageIndex={pageIndex} setPageIndex={setPageIndex} limit={10} total={tableModel.total} />
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
