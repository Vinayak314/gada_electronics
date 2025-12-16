
export const LANGUAGE_VERSIONS: Record<string, string> = {
    cpp: "10.2.0",
    python: "3.10.0",
    javascript: "18.15.0",
    typescript: "5.0.3",
    java: "15.0.2",
};

export const executeCode = async (language: string, sourceCode: string, input: string) => {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            language: language === "cpp" ? "c++" : language,
            version: LANGUAGE_VERSIONS[language] || "*",
            files: [
                {
                    content: sourceCode,
                },
            ],
            stdin: input,
        }),
    });

    return await response.json();
};
