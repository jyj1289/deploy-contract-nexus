
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
import { ethers } from 'ethers';

const ContractDeployment = () => {
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [bytecode, setBytecode] = useState("");
  const [constructorArgs, setConstructorArgs] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [deploymentResult, setDeploymentResult] = useState<any>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const networks = [
    { id: "ganache", name: "Ganache Local", chainId: 1337, color: "bg-orange-500", rpcUrl: "http://127.0.0.1:7545" },
    { id: "hardhat", name: "Hardhat Local", chainId: 31337, color: "bg-yellow-500", rpcUrl: "http://127.0.0.1:8545" },
    { id: "ethereum", name: "Ethereum Mainnet", chainId: 1, color: "bg-blue-500", rpcUrl: "https://mainnet.infura.io" },
    { id: "goerli", name: "Goerli Testnet", chainId: 5, color: "bg-yellow-500", rpcUrl: "https://goerli.infura.io" },
    { id: "polygon", name: "Polygon", chainId: 137, color: "bg-purple-500", rpcUrl: "https://polygon-rpc.com" },
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          // Assume it's a JSON file with bytecode
          const parsed = JSON.parse(content);
          setBytecode(parsed.bytecode || parsed.data || content);
          toast({
            title: "파일 업로드 성공",
            description: `${file.name} 파일이 성공적으로 업로드되었습니다.`,
          });
        } catch (error) {
          const content = e.target?.result as string;
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
    if (!selectedNetwork || !bytecode || !privateKey) {
      toast({
        title: "입력 오류",
        description: "네트워크, 바이트코드, 개인키를 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsDeploying(true);
    
    try {
      const selectedNet = networks.find(n => n.id === selectedNetwork);
      if (!selectedNet) {
        throw new Error("네트워크를 찾을 수 없습니다.");
      }

      // Connect to the network
      const provider = new ethers.JsonRpcProvider(selectedNet.rpcUrl);
      const wallet = new ethers.Wallet(privateKey, provider);

      // Clean bytecode
      const cleanBytecode = bytecode.startsWith('0x') ? bytecode : `0x${bytecode}`;

      // Parse constructor arguments if provided
      let constructorData = cleanBytecode;
      if (constructorArgs.trim()) {
        const args = constructorArgs.split(',').map(arg => arg.trim());
        const abiCoder = new ethers.AbiCoder();
        const encodedArgs = abiCoder.encode(['string[]'], [args]);
        constructorData = cleanBytecode + encodedArgs.slice(2);
      }

      // Create deployment transaction
      const tx = {
        data: constructorData,
        gasLimit: 3000000, // 3M gas limit
      };

      // Send transaction
      const deployTx = await wallet.sendTransaction(tx);
      const receipt = await deployTx.wait();

      if (receipt && receipt.status === 1) {
        const result = {
          contractAddress: receipt.contractAddress,
          transactionHash: receipt.hash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString(),
          deploymentCost: ethers.formatEther(deployTx.gasPrice! * receipt.gasUsed),
          status: "success"
        };
        
        setDeploymentResult(result);
        toast({
          title: "배포 성공! 🎉",
          description: "스마트 컨트랙트가 성공적으로 배포되었습니다.",
        });
      } else {
        throw new Error("배포 트랜잭션이 실패했습니다.");
      }
    } catch (error: any) {
      console.error("Deployment error:", error);
      toast({
        title: "배포 실패",
        description: error.message || "배포 중 오류가 발생했습니다.",
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

            {/* Private Key Input */}
            <div className="space-y-2">
              <Label htmlFor="private-key">개인키 (Private Key)</Label>
              <Input
                id="private-key"
                type="password"
                placeholder="0x로 시작하는 개인키를 입력하세요"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className="web3-input"
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
