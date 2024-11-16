/* eslint-disable @typescript-eslint/no-unused-vars */
export const isJsonString = (data: any) => {
    try {
        JSON.parse(data)
    } catch (error) {
        return false;
    }
    return true;
}

export function convertHtmlToText(html:any) {
    // Create a temporary DOM element to parse HTML
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
  
    // Use textContent to get the plain text
    return tempElement.textContent || tempElement.innerText || "";
  }