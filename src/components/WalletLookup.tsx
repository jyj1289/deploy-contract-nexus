
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const WalletLookup = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletData, setWalletData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const validateAddress = (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const lookupWallet = async () => {
    if (!walletAddress) {
      setError("지갑 주소를 입력해주세요.");
      return;
    }

    if (!validateAddress(walletAddress)) {
      setError("올바른 이더리움 주소 형식이 아닙니다.");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockWalletData = {
        address: walletAddress,
        ethBalance: "12.3456789",
        ethBalanceUSD: "24,691.36",
        transactionCount: 1847,
        firstSeen: "2021-03-15",
        lastActivity: "2024-01-20",
        tokens: [
          { symbol: "USDC", name: "USD Coin", balance: "5,432.10", value: "$5,432.10" },
          { symbol: "USDT", name: "Tether", balance: "2,100.00", value: "$2,100.00" },
          { symbol: "LINK", name: "Chainlink", balance: "150.75", value: "$2,261.25" },
          { symbol: "UNI", name: "Uniswap", balance: "89.32", value: "$534.25" },
        ],
        nfts: [
          { collection: "Bored Ape Yacht Club", count: 2 },
          { collection: "CryptoPunks", count: 1 },
          { collection: "Azuki", count: 5 },
        ],
        totalValue: "$35,019.06"
      };
      
      setWalletData(mockWalletData);
      toast({
        title: "지갑 조회 완료",
        description: "지갑 정보를 성공적으로 가져왔습니다.",
      });
    } catch (error) {
      setError("지갑 정보를 가져오는데 실패했습니다.");
      toast({
        title: "조회 실패",
        description: "지갑 정보를 가져오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setWalletAddress(value);
    setError("");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wallet Lookup Form */}
        <Card className="web3-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>💰</span>
              <span>Wallet Lookup</span>
            </CardTitle>
            <CardDescription>
              이더리움 지갑 주소를 입력하여 잔액과 토큰 정보를 조회하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet-address">지갑 주소</Label>
              <Input
                id="wallet-address"
                value={walletAddress}
                onChange={handleAddressChange}
                placeholder="0x742d35Cc6634C0532925a3b8D291803456789ABC"
                className="web3-input font-mono"
              />
              {error && (
                <p className="text-sm text-web3-error">{error}</p>
              )}
            </div>

            <Button
              onClick={lookupWallet}
              disabled={isLoading || !walletAddress}
              className="w-full web3-button"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="loading-spinner w-4 h-4" />
                  <span>조회 중...</span>
                </div>
              ) : (
                "지갑 조회"
              )}
            </Button>

            {/* Sample Addresses */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">샘플 주소:</Label>
              <div className="space-y-1">
                {[
                  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
                  "0x8ba1f109551bD432803012645Hac136c4f81aE3"
                ].map((addr, index) => (
                  <button
                    key={index}
                    onClick={() => setWalletAddress(addr)}
                    className="block w-full text-left text-xs text-web3-primary hover:text-web3-primary/80 font-mono p-2 rounded bg-muted/50 hover:bg-muted/70 transition-colors"
                  >
                    {addr}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Information */}
        <Card className="web3-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📊</span>
              <span>지갑 정보</span>
            </CardTitle>
            <CardDescription>
              조회된 지갑의 상세 정보
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="loading-spinner w-8 h-8 mb-4" />
                <p className="text-muted-foreground">지갑 정보를 조회하는 중...</p>
              </div>
            ) : walletData ? (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-3">
                  <Alert className="border-web3-success/30 bg-web3-success/10">
                    <AlertDescription>
                      <div className="flex justify-between items-center">
                        <span>Total Portfolio Value:</span>
                        <span className="text-web3-success font-bold text-lg">
                          {walletData.totalValue}
                        </span>
                      </div>
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Transaction Count</p>
                      <p className="text-lg font-semibold text-web3-primary">
                        {walletData.transactionCount.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">First Seen</p>
                      <p className="text-lg font-semibold text-web3-primary">
                        {walletData.firstSeen}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ETH Balance */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center space-x-2">
                    <span>💎</span>
                    <span>ETH Balance</span>
                  </h4>
                  <div className="p-4 bg-gradient-to-r from-web3-primary/10 to-web3-secondary/10 rounded-lg border border-web3-primary/20">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-web3-primary">
                          {walletData.ethBalance} ETH
                        </p>
                        <p className="text-muted-foreground">
                          ${walletData.ethBalanceUSD}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-web3-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-web3-primary text-xl">Ξ</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tokens */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center space-x-2">
                    <span>🪙</span>
                    <span>Tokens ({walletData.tokens.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {walletData.tokens.map((token, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-web3-secondary/20 rounded-full flex items-center justify-center">
                            <span className="text-xs font-mono">{token.symbol}</span>
                          </div>
                          <div>
                            <p className="font-medium">{token.symbol}</p>
                            <p className="text-xs text-muted-foreground">{token.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-web3-primary">{token.balance}</p>
                          <p className="text-xs text-muted-foreground">{token.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* NFTs */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center space-x-2">
                    <span>🖼️</span>
                    <span>NFTs</span>
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {walletData.nfts.map((nft, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm">{nft.collection}</span>
                        <Badge variant="secondary" className="bg-web3-accent/20 text-web3-accent">
                          {nft.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <p>지갑 주소를 입력하여 조회하세요</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletLookup;
