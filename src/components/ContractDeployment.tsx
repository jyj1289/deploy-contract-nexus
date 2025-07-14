
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const ContractDeployment = () => {
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [bytecode, setBytecode] = useState("");
  const [constructorArgs, setConstructorArgs] = useState("");
  const [deploymentResult, setDeploymentResult] = useState(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const { toast } = useToast();

  const networks = [
    { id: "ethereum", name: "Ethereum Mainnet", chainId: 1, color: "bg-blue-500" },
    { id: "goerli", name: "Goerli Testnet", chainId: 5, color: "bg-yellow-500" },
    { id: "polygon", name: "Polygon", chainId: 137, color: "bg-purple-500" },
    { id: "bsc", name: "BSC", chainId: 56, color: "bg-yellow-600" },
    { id: "arbitrum", name: "Arbitrum", chainId: 42161, color: "bg-blue-600" },
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          // Assume it's a JSON file with bytecode
          const parsed = JSON.parse(content);
          setBytecode(parsed.bytecode || parsed.data || content);
          toast({
            title: "파일 업로드 성공",
            description: `${file.name} 파일이 성공적으로 업로드되었습니다.`,
          });
        } catch (error) {
          setBytecode(content);
          toast({
            title: "파일 업로드 완료",
            description: "바이트코드가 입력되었습니다.",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDeploy = async () => {
    if (!selectedNetwork || !bytecode) {
      toast({
        title: "입력 오류",
        description: "네트워크와 바이트코드를 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsDeploying(true);
    
    // Simulate deployment process
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResult = {
        contractAddress: "0x742d35Cc6634C0532925a3b8D291803456789ABC",
        transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        blockNumber: 18245893,
        gasUsed: "2,134,567",
        deploymentCost: "0.0234",
        status: "success"
      };
      
      setDeploymentResult(mockResult);
      toast({
        title: "배포 성공! 🎉",
        description: "스마트 컨트랙트가 성공적으로 배포되었습니다.",
      });
    } catch (error) {
      toast({
        title: "배포 실패",
        description: "배포 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deployment Form */}
        <Card className="web3-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🚀</span>
              <span>Smart Contract Deployment</span>
            </CardTitle>
            <CardDescription>
              스마트 컨트랙트를 블록체인에 배포합니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Network Selection */}
            <div className="space-y-2">
              <Label htmlFor="network">네트워크 선택</Label>
              <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                <SelectTrigger className="web3-input">
                  <SelectValue placeholder="배포할 네트워크를 선택하세요" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {networks.map((network) => (
                    <SelectItem key={network.id} value={network.id}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${network.color}`} />
                        <span>{network.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {network.chainId}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file-upload">컨트랙트 파일 업로드</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="file-upload"
                  type="file"
                  accept=".json,.sol,.txt"
                  onChange={handleFileUpload}
                  className="web3-input"
                />
                {uploadedFile && (
                  <Badge variant="secondary" className="bg-web3-success/20 text-web3-success">
                    {uploadedFile.name}
                  </Badge>
                )}
              </div>
            </div>

            {/* Bytecode Input */}
            <div className="space-y-2">
              <Label htmlFor="bytecode">바이트코드</Label>
              <Textarea
                id="bytecode"
                placeholder="0x608060405234801561001057600080fd5b50..."
                value={bytecode}
                onChange={(e) => setBytecode(e.target.value)}
                className="web3-input min-h-[120px] font-mono text-sm"
              />
            </div>

            {/* Constructor Arguments */}
            <div className="space-y-2">
              <Label htmlFor="constructor-args">Constructor Arguments (선택사항)</Label>
              <Input
                id="constructor-args"
                placeholder="인수를 쉼표로 구분하여 입력하세요"
                value={constructorArgs}
                onChange={(e) => setConstructorArgs(e.target.value)}
                className="web3-input"
              />
            </div>

            {/* Deploy Button */}
            <Button
              onClick={handleDeploy}
              disabled={isDeploying || !selectedNetwork || !bytecode}
              className="w-full web3-button"
            >
              {isDeploying ? (
                <div className="flex items-center space-x-2">
                  <div className="loading-spinner w-4 h-4" />
                  <span>배포 중...</span>
                </div>
              ) : (
                "스마트 컨트랙트 배포"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Deployment Result */}
        <Card className="web3-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📋</span>
              <span>배포 결과</span>
            </CardTitle>
            <CardDescription>
              배포된 컨트랙트 정보를 확인하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isDeploying ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="loading-spinner w-8 h-8" />
                <p className="text-muted-foreground">배포 중입니다...</p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-web3-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
              </div>
            ) : deploymentResult ? (
              <div className="space-y-4">
                <Alert className="border-web3-success bg-web3-success/10">
                  <AlertDescription className="text-web3-success">
                    ✅ 배포가 성공적으로 완료되었습니다!
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Contract Address:</span>
                    <code className="text-sm text-web3-primary font-mono">
                      {deploymentResult.contractAddress}
                    </code>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Transaction Hash:</span>
                    <code className="text-sm text-web3-primary font-mono">
                      {deploymentResult.transactionHash.slice(0, 20)}...
                    </code>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Block Number:</span>
                    <span className="text-sm text-web3-primary">
                      #{deploymentResult.blockNumber}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Gas Used:</span>
                    <span className="text-sm text-web3-primary">
                      {deploymentResult.gasUsed}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Cost:</span>
                    <span className="text-sm text-web3-primary">
                      {deploymentResult.deploymentCost} ETH
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    View on Etherscan
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Copy Address
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <p>배포 결과가 여기에 표시됩니다</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContractDeployment;
