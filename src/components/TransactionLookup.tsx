
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const TransactionLookup = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchType, setSearchType] = useState("hash");
  const [transactionData, setTransactionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const validateInput = (input, type) => {
    if (type === "hash") {
      return /^0x[a-fA-F0-9]{64}$/.test(input);
    } else if (type === "address") {
      return /^0x[a-fA-F0-9]{40}$/.test(input);
    }
    return false;
  };

  const searchTransaction = async () => {
    if (!searchInput) {
      setError("검색할 값을 입력해주세요.");
      return;
    }

    if (!validateInput(searchInput, searchType)) {
      setError(`올바른 ${searchType === 'hash' ? '트랜잭션 해시' : '주소'} 형식이 아닙니다.`);
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTransactionData = {
        hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        status: "success",
        blockNumber: 18245893,
        blockHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        timestamp: "2024-01-20 14:30:25 UTC",
        from: "0x742d35Cc6634C0532925a3b8D291803456789ABC",
        to: "0x8ba1f109551bD432803012645Hac136c4f81aE3D",
        value: "0.5",
        gasLimit: "21000",
        gasUsed: "21000",
        gasPrice: "18.5",
        transactionFee: "0.0003885",
        transactionIndex: 142,
        nonce: 847,
        inputData: "0x",
        logs: [
          {
            address: "0x8ba1f109551bD432803012645Hac136c4f81aE3D",
            topics: ["0xa1b2c3d4e5f6789..."],
            data: "0x000000000000000000000000..."
          }
        ],
        confirmations: 15248
      };
      
      setTransactionData(mockTransactionData);
      toast({
        title: "트랜잭션 조회 완료",
        description: "트랜잭션 정보를 성공적으로 가져왔습니다.",
      });
    } catch (error) {
      setError("트랜잭션 정보를 가져오는데 실패했습니다.");
      toast({
        title: "조회 실패",
        description: "트랜잭션 정보를 가져오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-web3-success/20 text-web3-success border-web3-success/30">✅ Success</Badge>;
      case 'failed':
        return <Badge className="bg-web3-error/20 text-web3-error border-web3-error/30">❌ Failed</Badge>;
      case 'pending':
        return <Badge className="bg-web3-warning/20 text-web3-warning border-web3-warning/30">⏳ Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Form */}
        <Card className="web3-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📊</span>
              <span>Transaction Lookup</span>
            </CardTitle>
            <CardDescription>
              트랜잭션 해시나 주소로 트랜잭션 정보를 조회하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={searchType} onValueChange={setSearchType} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger 
                  value="hash"
                  className="data-[state=active]:bg-web3-primary data-[state=active]:text-white"
                >
                  Transaction Hash
                </TabsTrigger>
                <TabsTrigger 
                  value="address"
                  className="data-[state=active]:bg-web3-primary data-[state=active]:text-white"
                >
                  Address
                </TabsTrigger>
              </TabsList>

              <TabsContent value="hash" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tx-hash">트랜잭션 해시</Label>
                  <Input
                    id="tx-hash"
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                      setError("");
                    }}
                    placeholder="0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
                    className="web3-input font-mono text-sm"
                  />
                </div>
              </TabsContent>

              <TabsContent value="address" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">주소</Label>
                  <Input
                    id="address"
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                      setError("");
                    }}
                    placeholder="0x742d35Cc6634C0532925a3b8D291803456789ABC"
                    className="web3-input font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    해당 주소의 최근 트랜잭션을 조회합니다
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {error && (
              <p className="text-sm text-web3-error">{error}</p>
            )}

            <Button
              onClick={searchTransaction}
              disabled={isLoading || !searchInput}
              className="w-full web3-button"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="loading-spinner w-4 h-4" />
                  <span>조회 중...</span>
                </div>
              ) : (
                "트랜잭션 조회"
              )}
            </Button>

            {/* Sample Data */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">샘플 데이터:</Label>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setSearchType("hash");
                    setSearchInput("0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef");
                  }}
                  className="block w-full text-left text-xs text-web3-primary hover:text-web3-primary/80 font-mono p-2 rounded bg-muted/50 hover:bg-muted/70 transition-colors"
                >
                  Sample TX Hash
                </button>
                <button
                  onClick={() => {
                    setSearchType("address");
                    setSearchInput("0x742d35Cc6634C0532925a3b8D291803456789ABC");
                  }}
                  className="block w-full text-left text-xs text-web3-primary hover:text-web3-primary/80 font-mono p-2 rounded bg-muted/50 hover:bg-muted/70 transition-colors"
                >
                  Sample Address
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Details */}
        <Card className="web3-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🔍</span>
              <span>트랜잭션 상세 정보</span>
            </CardTitle>
            <CardDescription>
              조회된 트랜잭션의 상세 정보
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="loading-spinner w-8 h-8 mb-4" />
                <p className="text-muted-foreground">트랜잭션 정보를 조회하는 중...</p>
              </div>
            ) : transactionData ? (
              <div className="space-y-6">
                {/* Status */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  {getStatusBadge(transactionData.status)}
                </div>

                {/* Basic Info */}
                <div className="space-y-3">
                  <Alert className="border-web3-primary/30 bg-web3-primary/10">
                    <AlertDescription>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>Value:</span>
                          <span className="text-web3-primary font-bold">
                            {transactionData.value} ETH
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Transaction Fee:</span>
                          <span className="text-web3-primary font-mono">
                            {transactionData.transactionFee} ETH
                          </span>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Block Number:</span>
                        <span className="font-mono text-web3-primary">
                          #{transactionData.blockNumber}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Timestamp:</span>
                        <span className="font-mono text-sm">
                          {transactionData.timestamp}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Confirmations:</span>
                        <span className="font-mono text-web3-success">
                          {transactionData.confirmations.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div className="space-y-3">
                  <h4 className="font-medium">Addresses</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-muted-foreground">From:</span>
                        <code className="text-xs text-web3-primary font-mono text-right">
                          {transactionData.from}
                        </code>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-muted-foreground">To:</span>
                        <code className="text-xs text-web3-primary font-mono text-right">
                          {transactionData.to}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gas Information */}
                <div className="space-y-3">
                  <h4 className="font-medium">Gas Information</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Gas Limit</p>
                      <p className="font-mono text-web3-primary">
                        {transactionData.gasLimit}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Gas Used</p>
                      <p className="font-mono text-web3-primary">
                        {transactionData.gasUsed}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Gas Price</p>
                      <p className="font-mono text-web3-primary">
                        {transactionData.gasPrice} Gwei
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Nonce</p>
                      <p className="font-mono text-web3-primary">
                        {transactionData.nonce}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-3">
                  <h4 className="font-medium">Additional Information</h4>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Transaction Index:</span>
                      <span className="font-mono">{transactionData.transactionIndex}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground">Input Data:</span>
                      <code className="text-xs font-mono text-right">
                        {transactionData.inputData}
                      </code>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    View on Etherscan
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Copy Hash
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <p>트랜잭션 해시나 주소를 입력하여 조회하세요</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionLookup;
