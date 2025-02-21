'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { TableColumnsConfig } from '../../../../../types';
import AdminTable from '@/components/admin/AdminTable';

export default function AddBookPage() {
    const invoices = [
        {
            invoice: 'INV001',
            paymentStatus: 'Paid',
            totalAmount: '$250.00',
            paymentMethod: 'Credit Card'
        },
        {
            invoice: 'INV002',
            paymentStatus: 'Pending',
            totalAmount: '$150.00',
            paymentMethod: 'PayPal'
        },
        {
            invoice: 'INV003',
            paymentStatus: 'Unpaid',
            totalAmount: '$350.00',
            paymentMethod: 'Bank Transfer'
        },
        {
            invoice: 'INV004',
            paymentStatus: 'Paid',
            totalAmount: '$450.00',
            paymentMethod: 'Credit Card'
        },
        {
            invoice: 'INV005',
            paymentStatus: 'Paid',
            totalAmount: '$550.00',
            paymentMethod: 'PayPal'
        },
        {
            invoice: 'INV006',
            paymentStatus: 'Pending',
            totalAmount: '$200.00',
            paymentMethod: 'Bank Transfer'
        },
        {
            invoice: 'INV007',
            paymentStatus: 'Unpaid',
            totalAmount: '$300.00',
            paymentMethod: 'Credit Card'
        }
    ];
    const tableColumns: TableColumnsConfig<(typeof invoices)[0]> = {
        invoice: {
            header: 'Invoice'
        },
        paymentStatus: {
            header: 'Payment Status'
        },
        totalAmount: {
            header: 'Total Amount'
        },
        paymentMethod: {
            header: 'Payment Method'
        }
    };

    return (
        <>
            <Button asChild className="back-btn rounded-sm">
                <Link href="/admin/books">返回</Link>
            </Button>
            <section className="w-full">
                <AdminTable data={invoices} columns={tableColumns} title="所有书籍" />
            </section>
        </>
    );
}
