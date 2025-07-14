
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const GasOptimizer = () => {
  const [gasLimit, setGasLimit] = useState("21000");
  const [gasPrice, setGasPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [gasData, setGasData] = useState(null);
  const [selectedGasOption, setSelectedGasOption] = useState("standard");
  const { toast } = useToast();

  const fetchGasData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to get gas prices
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockGasData = {
        networkCongestion: 75,
        estimatedGasPrices: {
          slow: { price: "12", time: "10-15 min", cost: "0.00252" },
          standard: { price: "18", time: "3-5 min", cost: "0.00378" },
          fast: { price: "25", time: "< 2 min", cost: "0.00525" },
          instant: { price: "35", time: "< 30 sec", cost: "0.00735" }
        },
        recommendedGas: "18",
        baseFeeTrend: "increasing",
        nextBlockBaseFee: "14.2"
      };
      
      setGasData(mockGasData);
      setGasPrice(mockGasData.recommendedGas);
      
      toast({
        title: "가스비 정보 업데이트 완료",
        description: "최신 가스비 정보를 가져왔습니다.",
      });
    } catch (error) {
      toast({
        title: "가스비 정보 로딩 실패",
        description: "가스비 정보를 가져오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGasData();
  }, []);

  const handleGasOptionSelect = (option) => {
    setSelectedGasOption(option);
    if (gasData) {
      setGasPrice(gasData.estimatedGasPrices[option].price);
    }
  };

  const calculateTotalCost = () => {
    if (!gasLimit || !gasPrice) return "0";
    return ((parseInt(gasLimit) * parseFloat(gasPrice)) / 1e9).toFixed(6);
  };

  const getCongestionColor = (level) => {
    if (level < 30) return "text-web3-success";
    if (level < 70) return "text-web3-warning";
    return "text-web3-error";
  };

  const getCongestionBg = (level) => {
    if (level < 30) return "bg-web3-success";
    if (level < 70) return "bg-web3-warning";
    return "bg-web3-error";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gas Price Tracker */}
        <Card className="web3-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>⛽</span>
              <span>Gas Price Tracker</span>
            </CardTitle>
            <CardDescription>
              실시간 가스비 정보 및 네트워크 상태
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="loading-spinner w-8 h-8 mb-4" />
                <p className="text-muted-foreground">가스비 정보를 불러오는 중...</p>
              </div>
            ) : gasData ? (
              <>
                {/* Network Congestion */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>네트워크 혼잡도</Label>
                    <Badge variant="outline" className={getCongestionColor(gasData.networkCongestion)}>
                      {gasData.networkCongestion}%
                    </Badge>
                  </div>
                  <Progress 
                    value={gasData.networkCongestion} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>빠름</span>
                    <span>보통</span>
                    <span>느림</span>
                  </div>
                </div>

                {/* Base Fee Info */}
                <Alert className="border-web3-primary/30 bg-web3-primary/10">
                  <AlertDescription>
                    <div className="flex justify-between items-center">
                      <span>Next Block Base Fee:</span>
                      <span className="text-web3-primary font-mono">{gasData.nextBlockBaseFee} Gwei</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span>Trend:</span>
                      <Badge variant={gasData.baseFeeTrend === 'increasing' ? 'destructive' : 'secondary'}>
                        {gasData.baseFeeTrend === 'increasing' ? '📈 증가' : '📉 감소'}
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>

                {/* Gas Price Options */}
                <div className="space-y-3">
                  <Label>가스비 옵션 선택</Label>
                  {Object.entries(gasData.estimatedGasPrices).map(([key, data]) => (
                    <div
                      key={key}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedGasOption === key
                          ? 'border-web3-primary bg-web3-primary/10'
                          : 'border-border hover:border-border/50'
                      }`}
                      onClick={() => handleGasOptionSelect(key)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium capitalize">{key}</span>
                            {key === 'standard' && (
                              <Badge variant="secondary" className="text-xs">추천</Badge>
                            )}
                          </div>
                           <p className="text-sm text-muted-foreground">{(data as any).time}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-web3-primary">{(data as any).price} Gwei</p>
                          <p className="text-sm text-muted-foreground">~{(data as any).cost} ETH</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>가스비 정보를 불러올 수 없습니다</p>
              </div>
            )}

            <Button onClick={fetchGasData} variant="outline" className="w-full">
              🔄 새로고침
            </Button>
          </CardContent>
        </Card>

        {/* Gas Calculator */}
        <Card className="web3-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🧮</span>
              <span>Gas Calculator</span>
            </CardTitle>
            <CardDescription>
              트랜잭션 비용을 미리 계산해보세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gas-limit">Gas Limit</Label>
              <Input
                id="gas-limit"
                value={gasLimit}
                onChange={(e) => setGasLimit(e.target.value)}
                placeholder="21000"
                className="web3-input font-mono"
              />
              <p className="text-xs text-muted-foreground">
                기본 전송: 21,000 | 스마트 컨트랙트: 50,000~200,000+
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gas-price">Gas Price (Gwei)</Label>
              <Input
                id="gas-price"
                value={gasPrice}
                onChange={(e) => setGasPrice(e.target.value)}
                placeholder="18"
                className="web3-input font-mono"
              />
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium">비용 계산</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gas Limit:</span>
                  <span className="font-mono">{gasLimit || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gas Price:</span>
                  <span className="font-mono">{gasPrice || '0'} Gwei</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-medium">
                  <span>Total Cost:</span>
                  <span className="text-web3-primary font-mono">
                    {calculateTotalCost()} ETH
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>USD (ETH @ $2,000):</span>
                  <span>${(parseFloat(calculateTotalCost()) * 2000).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Optimization Tips */}
            <Alert className="border-web3-warning/30 bg-web3-warning/10">
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium text-web3-warning">💡 가스비 절약 팁</p>
                  <ul className="text-sm space-y-1">
                    <li>• 네트워크 혼잡하지 않은 시간대 이용</li>
                    <li>• 여러 트랜잭션을 배치로 처리</li>
                    <li>• 가스 한도를 적절히 설정</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>

            <Button 
              className="w-full web3-button"
              onClick={() => {
                toast({
                  title: "가스비 설정 완료",
                  description: `${gasPrice} Gwei로 가스비가 설정되었습니다.`,
                });
              }}
            >
              가스비 적용
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GasOptimizer;
