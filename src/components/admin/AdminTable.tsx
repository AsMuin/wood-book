'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCallback, useEffect, useImperativeHandle, useState, type ReactNode, createContext, useContext, useMemo } from 'react';
import { IResponse, QueryParams, SearchColumnItem, SearchColumns, TableColumns } from '@types';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/useToast';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface TableContextType<T, P extends Record<string, any>> {
    data: T[];
    pageIndex: number;
    limit: number;
    total: number;
    searchParams?: P;
    searchColumns?: SearchColumnItem<P>[];
    setPageIndex?: (value: number) => void;
    setSearchParams?: (key: keyof P) => (value: P[keyof P]) => void;
}
// tableContext 传递组件参数
const TableContext = createContext<TableContextType<any, any>>({
    data: [],
    pageIndex: 0,
    limit: 10,
    total: 0
});

function TableContextProvider<T, P extends Record<string, any>>({ children, value }: { children: ReactNode; value: TableContextType<T, P> }) {
    return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
}

// 校验context合法性
function useTableContext<T, P extends Record<string, any>>() {
    const context = useContext(TableContext as React.Context<TableContextType<T, P>>);

    if (!context) {
        throw new Error('useTableContext 必须包裹在 Provider 中');
    }

    return context;
}

interface AdminTableProps<T extends Record<string, any>, P extends Record<string, any>> {
    title: ReactNode;
    query: (params: QueryParams<P>) => Promise<IResponse<T[]>>;
    searchFilter?: SearchColumns<P>;
    // data: T[];
    columns: Partial<TableColumns<T>>;
    operations?: (rowData: T) => ReactNode;
    limit?: number;
    ref?: React.RefObject<{ query: () => Promise<void> } | null>;
}

interface TableModel<T extends Record<string, any>> {
    data: T[];
    total: number;
}

function AdminTable<T extends Record<string, any>, P extends Record<string, any>>({
    columns,
    title,
    operations,
    query,
    limit = 10,
    searchFilter,
    ref
}: AdminTableProps<T, P>) {
    const [tableModel, setTableModel] = useState<TableModel<T>>({
        data: [],
        total: 0
    });
    const [pageIndex, setPageIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    //表格渲染配置初始化
    const renderColumns = useMemo(
        () =>
            Object.keys(columns).map(key => ({
                key,
                ...columns[key]
            })),
        [columns]
    );
    // 搜索配置初始化
    const searchColumns: SearchColumnItem<P>[] = useMemo(
        () =>
            searchFilter
                ? Object.keys(searchFilter).map(key => ({
                      key,
                      ...searchFilter[key]
                  }))
                : [],
        [searchFilter]
    );
    // 搜索项的默认值
    const [searchParams, setSearchParams] = useState<P>(
        searchColumns.reduce((acc, { key, defaultValue }) => {
            (acc as any)[key] = defaultValue || '';

            return acc;
        }, {} as P)
    );
    // 真正的请求方法,接收所有请求相关的参数
    const onQuery = useCallback(
        async ({ limit, pageIndex, signal, ...searchParams }: QueryParams<P>) => {
            setLoading(true);

            try {
                const result = await query({ limit, pageIndex, signal, ...searchParams } as QueryParams<P>);

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

    // 搜索项参数修改
    function onSearchParamsChange(key: keyof P) {
        return (value: P[typeof key]) => {
            setSearchParams(prev => ({
                ...prev,
                [key]: value
            }));
        };
    }

    // 整合tableContext传递的参数
    const contextValue: TableContextType<T, P> = {
        data: tableModel.data,
        pageIndex,
        limit,
        total: tableModel.total,
        searchParams,
        searchColumns: searchColumns,
        setPageIndex,
        setSearchParams: onSearchParamsChange
    };

    //主动暴露 表格请求方法给外部进行控制
    useImperativeHandle(ref, () => ({
        query: (signal?: AbortSignal) => onQuery({ pageIndex, limit, signal, ...searchParams })
    }));
    // 监听分页标自动请求表格数据
    useEffect(() => {
        const controller = new AbortController();

        onQuery({ pageIndex, limit, signal: controller.signal, ...searchParams });

        return () => {
            controller.abort();
        };
    }, [onQuery, pageIndex, limit]);

    return (
        <TableContextProvider value={contextValue}>
            <div className="mb-2 flex justify-between border-b-2 px-4 pb-2 font-bebas-neue text-3xl">
                <h3>{title}</h3>
            </div>
            <div className="flex justify-between">
                {searchFilter && <AdminTable.SearchFilter />}
                <Button className="bg-light-100" disabled={loading} onClick={() => onQuery({ pageIndex, limit, ...searchParams })}>
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
        </TableContextProvider>
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

// 表格分页标，接收数据的总量和limit完成页码划分
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

// interface AdminTableSearchFilterProps<P extends Record<string, any>> {
//     searchFilter: SearchFilter<P>;
// }

// 表格搜索项
AdminTable.SearchFilter = function AdminTableSearchFilter<P extends Record<string, any>>() {
    const { searchParams, setSearchParams, searchColumns: searchConfigList } = useTableContext<any, P>();

    return (
        <div className="flex justify-end">
            {searchConfigList &&
                searchConfigList.map(({ key, label, placeholder, render }) => {
                    if (render) {
                        return <div key={key as string}>{render(searchParams![key], searchParams!, setSearchParams!(key))}</div>;
                    } else {
                        return (
                            <label key={key as string} className="flex items-center gap-2 px-3 text-sm font-medium text-gray-900">
                                {label && <span className="min-w-fit font-semibold text-slate-700">{label + '：'}</span>}
                                <Input
                                    placeholder={placeholder}
                                    value={searchParams![key]}
                                    className="duration-300"
                                    onChange={e => {
                                        const value = e.target.value;

                                        setSearchParams!(key)(value as any);
                                    }}
                                />
                            </label>
                        );
                    }
                })}
        </div>
    );
};

export default AdminTable;
