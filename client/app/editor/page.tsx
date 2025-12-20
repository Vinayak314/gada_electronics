"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Save, Upload } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import Editor from "@monaco-editor/react"
import { executeCode } from "@/lib/piston"

const TEMPLATES = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your code here
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cout << "Hello, World!"; 
    return 0;
}`,
  python: `import sys

def main():
    # Write your code here
    print("Hello, World!")

if __name__ == "__main__":
    main()`,
  java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        // Write your code here
        System.out.println("Hello, World!");
    }
}`,
}

export default function CodeEditorPage() {
  const [language, setLanguage] = useState("cpp")
  const [code, setCode] = useState(TEMPLATES.cpp)
  const [output, setOutput] = useState("")
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleRun = async () => {
    setIsLoading(true)
    setOutput("Running code...")

    try {
      const { run: result } = await executeCode(language, code, input)

      setOutput(result.output)
      // Note: Piston doesn't always return detailed usage stats in the same format, 
      // but if available we can use them. Piston returns stdout/stderr/code/signal.
      // We will assume result contains output.
    } catch (error) {
      setOutput("Error executing code: " + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-950">
        <div className="flex-1 border-r border-white/10 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Code Editor</h1>
            <div className="flex items-center gap-4">
              <Select
                value={language}
                onValueChange={(value) => {
                  setLanguage(value)
                  setCode(TEMPLATES[value as keyof typeof TEMPLATES])
                }}
              >
                <SelectTrigger className="w-40 border-white/30 bg-white/10 text-white [&>span]:text-white">
                  <SelectValue placeholder="Choose language" />
                </SelectTrigger>
                <SelectContent className="border-white/20 bg-slate-900 text-white">
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleRun} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                <Play className="mr-2 h-4 w-4" />
                {isLoading ? "Running..." : "Run"}
              </Button>
            </div>
          </div>

          <Card className="h-[calc(100vh-180px)] overflow-hidden border-white/20 bg-slate-900/50 p-0">
            <Editor
              height="100%"
              language={language}
              value={code}
              theme="vs-dark"
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
              }}
            />
          </Card>
        </div>

        <div className="w-96 bg-slate-900 p-6 flex flex-col">
          <div className="mb-4">
            <h2 className="mb-3 text-xl font-bold text-white">Input</h2>
            <Card className="border-white/20 bg-black/40 p-0">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="h-32 resize-none border-0 bg-transparent font-mono text-sm text-white placeholder:text-white/40 focus-visible:ring-0"
                placeholder="Enter test input here..."
              />
            </Card>
          </div>

          <div className="flex-1 flex flex-col">
            <h2 className="mb-3 text-xl font-bold text-white">Output</h2>
            <Card className="flex-1 overflow-auto border-white/20 bg-black/40 p-4">
              <pre className="whitespace-pre-wrap font-mono text-sm text-green-400">
                {output || "Run your code to see output here..."}
              </pre>
            </Card>
          </div>

        </div>
      </div>
    </ProtectedRoute >
  )
}
