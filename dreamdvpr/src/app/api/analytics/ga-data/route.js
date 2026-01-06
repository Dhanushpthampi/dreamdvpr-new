import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const analyticsDataClient = google.analyticsdata('v1beta');

async function getAuthClient() {
    const auth = new google.auth.GoogleAuth({
        keyFile: './service-account.json',
        scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });
    return await auth.getClient();
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate') || '30daysAgo';
        const endDate = searchParams.get('endDate') || 'today';
        const propertyId = process.env.GA_PROPERTY_ID;

        if (!propertyId) {
            return NextResponse.json(
                { error: 'GA_PROPERTY_ID not configured in environment variables' },
                { status: 500 }
            );
        }

        const authClient = await getAuthClient();

        // Fetch main metrics
        const metricsResponse = await analyticsDataClient.properties.runReport({
            auth: authClient,
            property: `properties/${propertyId}`,
            requestBody: {
                dateRanges: [{ startDate, endDate }],
                metrics: [
                    { name: 'activeUsers' },
                    { name: 'sessions' },
                    { name: 'screenPageViews' },
                    { name: 'bounceRate' },
                    { name: 'averageSessionDuration' },
                ],
            },
        });

        // Fetch traffic sources
        const sourcesResponse = await analyticsDataClient.properties.runReport({
            auth: authClient,
            property: `properties/${propertyId}`,
            requestBody: {
                dateRanges: [{ startDate, endDate }],
                dimensions: [{ name: 'sessionSource' }],
                metrics: [{ name: 'sessions' }],
                limit: 5,
                orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
            },
        });

        // Fetch device categories
        const devicesResponse = await analyticsDataClient.properties.runReport({
            auth: authClient,
            property: `properties/${propertyId}`,
            requestBody: {
                dateRanges: [{ startDate, endDate }],
                dimensions: [{ name: 'deviceCategory' }],
                metrics: [{ name: 'sessions' }],
            },
        });

        // Fetch page views over time (last 30 days)
        const timeSeriesResponse = await analyticsDataClient.properties.runReport({
            auth: authClient,
            property: `properties/${propertyId}`,
            requestBody: {
                dateRanges: [{ startDate, endDate }],
                dimensions: [{ name: 'date' }],
                metrics: [{ name: 'screenPageViews' }],
                orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }],
            },
        });

        // Fetch top pages
        const pagesResponse = await analyticsDataClient.properties.runReport({
            auth: authClient,
            property: `properties/${propertyId}`,
            requestBody: {
                dateRanges: [{ startDate, endDate }],
                dimensions: [{ name: 'pagePath' }],
                metrics: [{ name: 'screenPageViews' }],
                limit: 10,
                orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
            },
        });

        // Format the response
        const mainMetrics = metricsResponse.data.rows?.[0]?.metricValues || [];
        const formattedData = {
            summary: {
                activeUsers: parseInt(mainMetrics[0]?.value || '0'),
                sessions: parseInt(mainMetrics[1]?.value || '0'),
                pageViews: parseInt(mainMetrics[2]?.value || '0'),
                bounceRate: parseFloat(mainMetrics[3]?.value || '0').toFixed(2),
                avgSessionDuration: parseFloat(mainMetrics[4]?.value || '0').toFixed(2),
            },
            trafficSources: sourcesResponse.data.rows?.map(row => ({
                source: row.dimensionValues[0].value,
                sessions: parseInt(row.metricValues[0].value),
            })) || [],
            devices: devicesResponse.data.rows?.map(row => ({
                category: row.dimensionValues[0].value,
                sessions: parseInt(row.metricValues[0].value),
            })) || [],
            pageViewsOverTime: timeSeriesResponse.data.rows?.map(row => ({
                date: row.dimensionValues[0].value,
                pageViews: parseInt(row.metricValues[0].value),
            })) || [],
            topPages: pagesResponse.data.rows?.map(row => ({
                path: row.dimensionValues[0].value,
                views: parseInt(row.metricValues[0].value),
            })) || [],
        };

        return NextResponse.json(formattedData);
    } catch (error) {
        console.error('Error fetching Google Analytics data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics data', details: error.message },
            { status: 500 }
        );
    }
}
