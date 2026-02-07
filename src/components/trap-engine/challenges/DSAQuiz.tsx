"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Timer, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const QUESTIONS = [
    { q: "What is the time complexity of QuickSort in the worst case?", o: ["O(n log n)", "O(n)", "O(n^2)", "O(log n)"], a: 2 },
    { q: "In a Red-Black Tree, what is the color of the root node?", o: ["Red", "Black", "Either", "Green"], a: 1 },
    { q: "What data structure is used for Breadth-First Search (BFS)?", o: ["Stack", "Queue", "Priority Queue", "Heap"], a: 1 },
    { q: "Which of these is NOT a stable sorting algorithm?", o: ["Merge Sort", "Insertion Sort", "Quick Sort", "Bubble Sort"], a: 2 },
    { q: "What is the height of a balanced Binary Search Tree with n nodes?", o: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], a: 1 },
    { q: "Dijkstra's algorithm may fail if the graph has...", o: ["Cycles", "Negative edge weights", "Positive edge weights", "Disconnected nodes"], a: 1 },
    { q: "What is the space complexity of Depth First Search (recursive)?", o: ["O(1)", "O(n) - stack depth", "O(log n)", "O(n^2)"], a: 1 },
    { q: "Which data structure implements LIFO?", o: ["Queue", "Stack", "Array", "Linked List"], a: 1 },
    { q: "Dynamic Programming is best suited for problems with...", o: ["Overlapping subproblems", "Disjoint subproblems", "Simple subproblems", "Random subproblems"], a: 0 },
    { q: "In Python, what is the average time complexity of dictionary lookup?", o: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], a: 2 },
];

export const DSAQuiz = ({ onFail, onSuccess }: { onFail: () => void, onSuccess: () => void }) => {
    const [index, setIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
    const [answers, setAnswers] = useState<number[]>([]);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        if (failed) return;
        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(timer);
                    setFailed(true);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [failed]);

    const handleAnswer = (optionIndex: number) => {
        const newAnswers = [...answers, optionIndex];
        setAnswers(newAnswers);

        if (QUESTIONS[index].a !== optionIndex) {
            // Wrong answer
            setFailed(true);
            return;
        }

        if (index < QUESTIONS.length - 1) {
            setIndex(index + 1);
        } else {
            // Finished all correct
            onSuccess(); // Note: Success here means they can REJECT. But we might want to troll them even if they win.
        }
    };

    if (failed) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 font-mono text-green-500">
                <div className="text-center space-y-4 max-w-md border border-green-500/30 p-8 rounded-xl bg-black">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                    <h2 className="text-2xl font-bold text-red-500">SEGMENTATION FAULT</h2>
                    <p>You failed to optimize your heart's algorithm.</p>
                    <p className="text-xs text-gray-500">Resetting connection to reality...</p>
                    <Button onClick={onFail} className="bg-green-900/20 text-green-400 border border-green-500/50 hover:bg-green-900/40 w-full mt-4">
                        Reboot System (Try Again)
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-xl shadow-2xl p-6 md:p-8 font-mono text-zinc-100"
            >
                <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <AlertTriangle className="text-yellow-500" />
                        Rejection Aptitude Test
                    </h2>
                    <div className="flex items-center gap-2 text-xl font-bold text-red-500">
                        <Timer className="animate-pulse" />
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="text-xs text-zinc-500 uppercase tracking-widest">Question {index + 1}/{QUESTIONS.length}</div>
                        <h3 className="text-lg md:text-xl font-medium">{QUESTIONS[index].q}</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {QUESTIONS[index].o.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(i)}
                                className="text-left px-4 py-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all hover:translate-x-1"
                            >
                                <span className="text-zinc-500 mr-2">{String.fromCharCode(65 + i)})</span>
                                {opt}
                            </button>
                        ))}
                    </div>

                    <p className="text-xs text-zinc-600 text-center uppercase">
                        Warning: One wrong move terminates the session.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
