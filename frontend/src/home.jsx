import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, ArrowRight, Copy, CheckCircle, Zap, Shield, BarChart2, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"


export default function Home() {
    const [longUrl, setLongUrl] = useState('')
    const [shortUrl, setShortUrl] = useState('')
    const [copied, setCopied] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async(e) => {
        e.preventDefault()
        setLoading(true)
        const response = await fetch(`${"https://shorturl-7tor.onrender.com"}/shorten`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputUrl: longUrl })
        })

        setLoading(false)
        const data = await response.json()
        console.log(data)
        setShortUrl(data.shortUrl)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <header className="container mx-auto px-4 py-6 flex justify-between items-center">
                <div className="text-white text-2xl font-bold">URL Shortener</div>
                <nav>
                    <ul className="flex space-x-4">
                        <li><a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a></li>
                        <li><a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a></li>
                    </ul>
                </nav>
            </header>

            <main>
                <section className="container mx-auto px-4 py-20 text-center">
                    <motion.h1
                        className="text-5xl md:text-6xl font-bold text-white mb-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Shorten Your Links, Expand Your Reach
                    </motion.h1>
                    <motion.p
                        className="text-xl text-gray-300 mb-12"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        Transform long URLs into concise, powerful links in seconds.
                    </motion.p>
                    <motion.form
                        onSubmit={handleSubmit}
                        className="max-w-3xl mx-auto mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-grow">
                                <Input
                                    type="url"
                                    value={longUrl}
                                    onChange={(e) => setLongUrl(e.target.value)}
                                    placeholder="Enter your long URL here"
                                    className="w-full pl-10 pr-4 py-3 bg-white text-gray-900"
                                    required
                                />
                                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                            <Button type="submit" className="bg-blue-300 hover:bg-blue-400 ease-linear duration-100 rounded">
                                {loading ? "loading" : "Shorten URL"}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </motion.form>

                    {shortUrl && (
                        <motion.div
                            className="max-w-3xl mx-auto mb-12"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card>
                                <CardContent className="p-4">
                                    <h2 className="text-xl font-semibold text-green-300 mb-2">Your shortened URL:</h2>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="text"
                                            value={shortUrl}
                                            readOnly
                                            className="flex-grow bg-gray-100"
                                        />
                                        <Button onClick={copyToClipboard}
                                        className="border border-slate-200 text-slate-200 hover:bg-green-500 rounded "
                                        variant="outline">
                                            {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </section>

                <section id="features" className="bg-gray-800 py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-white mb-12">Why Choose Our URL Shortener?</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { icon: Zap, title: "Lightning Fast", description: "Shorten URLs instantly with our high-performance system." },
                                { icon: Shield, title: "Secure & Reliable", description: "Your data is protected with state-of-the-art encryption." },
                                { icon: BarChart2, title: "Detailed Analytics", description: "Gain insights with comprehensive click tracking and reporting." }
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-gray-700 p-6 rounded-lg"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 * index }}
                                >
                                    <feature.icon className="h-12 w-12 text-blue-400 mb-4" />
                                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                    <p className="text-gray-300">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="testimonials" className="py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-white mb-12">What Our Users Say</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {[
                                { name: "Alex Johnson", role: "Digital Marketer", content: "This URL shortener has been a game-changer for our marketing campaigns. The analytics are incredibly detailed!" },
                                { name: "Sarah Lee", role: "Social Media Manager", content: "I love how easy it is to create and share short links. It's boosted our click-through rates significantly." }
                            ].map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-gray-700 p-6 rounded-lg"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 * index }}
                                >
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-gray-600 rounded-full mr-4"></div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                                            <p className="text-gray-400">{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-300">{testimonial.content}</p>
                                    <div className="flex mt-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">URL Shortener</h3>
                            <p className="text-gray-400">Simplifying links, amplifying reach.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                            <p className="text-gray-400">support@urlshortener.com</p>
                            <p className="text-gray-400">1-800-SHORT-URL</p>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
                        <p>&copy; 2023 URL Shortener. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

