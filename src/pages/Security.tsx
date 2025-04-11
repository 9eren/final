
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, CheckCircle, AlertTriangle } from "lucide-react";
import Header from "@/components/Header";

const Security = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-purple-dark">Security & Privacy</h1>
          <p className="text-muted-foreground">BillBoy uses end-to-end encryption to protect your sensitive bill information</p>
        </div>
        
        <div className="flex justify-center mb-8">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center py-3 px-4 text-base">
            <Shield className="mr-2 h-5 w-5" /> Your data is protected with end-to-end encryption
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center text-green-700">
                <Lock className="mr-2 h-5 w-5" /> End-to-End Encryption
              </CardTitle>
              <CardDescription className="text-green-600">
                Your bill data is encrypted on your device
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span>All bill contents are encrypted before being sent to our servers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span>Only you can access your bill data with your encryption keys</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span>We use AES-256 encryption, the industry standard for secure data</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span>Your encryption keys never leave your device</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" /> How Your Data Is Protected
              </CardTitle>
              <CardDescription>
                Understanding our security measures
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Client-Side Encryption</h3>
                  <p className="text-sm text-muted-foreground">
                    Bill data is encrypted directly on your device before being transmitted or stored. This means that even if our servers were compromised, your data would remain secure.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Zero-Knowledge Architecture</h3>
                  <p className="text-sm text-muted-foreground">
                    We employ a zero-knowledge system where we have no ability to view or access your bill data. Only you hold the keys to decrypt your information.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Secure Data Transmission</h3>
                  <p className="text-sm text-muted-foreground">
                    All data is transmitted using TLS 1.3 encryption, ensuring that your information remains protected during transit.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8 border-amber-200">
          <CardHeader className="bg-amber-50">
            <CardTitle className="flex items-center text-amber-700">
              <AlertTriangle className="mr-2 h-5 w-5" /> Important Security Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4">
              For maximum security, please remember:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <span>Never share your encryption keys or account credentials with anyone</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <span>Always log out of BillBoy when using shared or public devices</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <span>Keep your device's operating system and browser up to date</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
      
      <footer className="bg-white border-t border-border py-4 px-6 text-center text-sm text-muted-foreground">
        <p>BillBoy &copy; {new Date().getFullYear()} • End-to-end encrypted</p>
      </footer>
    </div>
  );
};

export default Security;
