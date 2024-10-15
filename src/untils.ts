/* eslint-disable @typescript-eslint/no-unused-vars */
export const isJsonString = (data: any) => {
    try {
        JSON.parse(data)
    } catch (error) {
        return false;
    }
    return true;
}