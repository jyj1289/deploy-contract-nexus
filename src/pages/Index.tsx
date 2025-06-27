
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ContractDeployment from "@/components/ContractDeployment";
import GasOptimizer from "@/components/GasOptimizer";
import WalletLookup from "@/components/WalletLookup";
import TransactionLookup from "@/components/TransactionLookup";

const Index = () => {
  const [activeTab, setActiveTab] = useState("deploy");

  return (
    <div className="min-h-screen bg-web3-darker">
      {/* Header */}
      <header className="border-b border-border/50 glass-effect sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-web3-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-web3-gradient bg-clip-text text-transparent">
                  SCDS
                </h1>
                <p className="text-sm text-muted-foreground">Smart Contract Deploy Service</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-web3-success/20 text-web3-success border-web3-success/30">
                Mainnet
              </Badge>
              <div className="text-sm text-muted-foreground">
                Block: <span className="text-web3-primary">18,245,892</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold mb-4 bg-web3-gradient bg-clip-text text-transparent">
            Web3 스마트 컨트랙트를 쉽게 배포하세요
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            복잡한 블록체인 기술을 간단한 인터페이스로 누구나 쉽게 스마트 컨트랙트를 배포하고 관리할 수 있습니다.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="web3-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Deployments</p>
                  <p className="text-2xl font-bold text-web3-primary">1,247</p>
                </div>
                <div className="w-12 h-12 bg-web3-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-web3-primary text-xl">🚀</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="web3-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Gas Saved</p>
                  <p className="text-2xl font-bold text-web3-success">23.4 ETH</p>
                </div>
                <div className="w-12 h-12 bg-web3-success/20 rounded-full flex items-center justify-center">
                  <span className="text-web3-success text-xl">⛽</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="web3-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-web3-accent">894</p>
                </div>
                <div className="w-12 h-12 bg-web3-accent/20 rounded-full flex items-center justify-center">
                  <span className="text-web3-accent text-xl">👥</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="web3-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold text-web3-primary">99.7%</p>
                </div>
                <div className="w-12 h-12 bg-web3-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-web3-primary text-xl">✅</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Services */}
        <Card className="web3-card">
          <CardHeader>
            <CardTitle className="text-2xl">Web3 Services</CardTitle>
            <CardDescription>
              스마트 컨트랙트 배포부터 트랜잭션 조회까지 모든 Web3 서비스를 한 곳에서
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                <TabsTrigger 
                  value="deploy" 
                  className="data-[state=active]:bg-web3-primary data-[state=active]:text-white"
                >
                  🚀 Contract Deploy
                </TabsTrigger>
                <TabsTrigger 
                  value="gas" 
                  className="data-[state=active]:bg-web3-primary data-[state=active]:text-white"
                >
                  ⛽ Gas Optimizer
                </TabsTrigger>
                <TabsTrigger 
                  value="wallet" 
                  className="data-[state=active]:bg-web3-primary data-[state=active]:text-white"
                >
                  💰 Wallet Lookup
                </TabsTrigger>
                <TabsTrigger 
                  value="transaction" 
                  className="data-[state=active]:bg-web3-primary data-[state=active]:text-white"
                >
                  📊 Transaction
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="deploy" className="animate-slide-up">
                  <ContractDeployment />
                </TabsContent>
                
                <TabsContent value="gas" className="animate-slide-up">
                  <GasOptimizer />
                </TabsContent>
                
                <TabsContent value="wallet" className="animate-slide-up">
                  <WalletLookup />
                </TabsContent>
                
                <TabsContent value="transaction" className="animate-slide-up">
                  <TransactionLookup />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-16 border-t border-border/50 pt-8">
          <div className="text-center text-muted-foreground">
            <p>© 2024 SCDS - Smart Contract Deploy Service. Powered by Web3 Technology.</p>
            <p className="mt-2 text-sm">
              🔒 Secure • ⚡ Fast • 🌐 Decentralized
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
