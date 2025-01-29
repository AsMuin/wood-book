// import { NextResponse } from 'next/server';
import { IResponse } from '../../types';

function responseBody<T = undefined>(success: boolean, message: string, returnInfo?: { data: T }) {
    const responseBody = {
        success,
        message,
        data: returnInfo?.data
    };

    return responseBody as IResponse<T>;
}

export default responseBody;
