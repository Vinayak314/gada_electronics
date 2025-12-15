"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Save, Upload } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export default function CodeEditorPage() {
  const [code, setCode] = useState(`#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your code here
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cout << "Hello, World!"; 
    return 0;
}`)
  const [language, setLanguage] = useState("cpp")
  const [output, setOutput] = useState("")
  const [input, setInput] = useState("")

  const handleRun = () => {
    setOutput(
      `Running code with input...\n\nInput:\n${input || "(empty)"}\n\nOutput:\nHello, World!\n\nExecution time: 0.42s\nMemory used: 14.2 MB`,
    )
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-950">
        <div className="flex-1 border-r border-white/10 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Code Editor</h1>
            <div className="flex items-center gap-4">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-40 border-white/30 bg-white/10 text-white [&>span]:text-white">
                  <SelectValue placeholder="Choose language" />
                </SelectTrigger>
                <SelectContent className="border-white/20 bg-slate-900 text-white">
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleRun} className="bg-green-600 hover:bg-green-700">
                <Play className="mr-2 h-4 w-4" />
                Run
              </Button>
              <Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Upload className="mr-2 h-4 w-4" />
                Submit
              </Button>
            </div>
          </div>

          <Card className="h-[calc(100vh-180px)] overflow-hidden border-white/20 bg-slate-900/50 p-0">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-full resize-none border-0 bg-transparent font-mono text-sm text-white focus-visible:ring-0"
              placeholder="Write your code here..."
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

          <div className="mt-4 space-y-2">
            <div className="rounded-lg bg-white/5 p-3">
              <div className="text-sm text-white/70">Test Cases Passed</div>
              <div className="text-2xl font-bold text-white">0 / 10</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-white/5 p-3">
                <div className="text-sm text-white/70">Time</div>
                <div className="text-lg font-bold text-white">-- ms</div>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <div className="text-sm text-white/70">Memory</div>
                <div className="text-lg font-bold text-white">-- MB</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
