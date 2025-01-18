// import { NextResponse } from 'next/server';
import { IResponse } from '../../types';

function apiResponse<T = any>(success: boolean, message: string, returnInfo?: { data: T; token?: string }) {
    const responseBody: IResponse<T> = {
        success,
        message,
        ...(returnInfo?.data && {
            data: returnInfo.data
        }),
        ...(returnInfo?.token && {
            token: returnInfo.token
        })
    };

    // return NextResponse.json(responseBody);
    return responseBody;
}

export default apiResponse;
