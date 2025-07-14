
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
  const [contractSource, setContractSource] = useState("");
  const [constructorArgs, setConstructorArgs] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [deploymentResult, setDeploymentResult] = useState<any>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const networks = [
    { id: "ganache", name: "Ganache Local", chainId: 1337, color: "bg-orange-500", rpcUrl: "http://127.0.0.1:7545", explorer: null },
    { id: "hardhat", name: "Hardhat Local", chainId: 31337, color: "bg-yellow-500", rpcUrl: "http://127.0.0.1:8545", explorer: null },
    { id: "ethereum", name: "Ethereum Mainnet", chainId: 1, color: "bg-blue-500", rpcUrl: "https://mainnet.infura.io", explorer: "https://etherscan.io" },
    { id: "goerli", name: "Goerli Testnet", chainId: 5, color: "bg-yellow-500", rpcUrl: "https://goerli.infura.io", explorer: "https://goerli.etherscan.io" },
    { id: "polygon", name: "Polygon", chainId: 137, color: "bg-purple-500", rpcUrl: "https://polygon-rpc.com", explorer: "https://polygonscan.com" },
  ];

  const compileContract = async (sourceCode: string) => {
    setIsCompiling(true);
    try {
      // Simple compilation simulation for browser environment
      // In a real implementation, you would use Remix API or a compilation service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Extract a simple bytecode pattern for demo purposes
      // In reality, this would come from actual Solidity compilation
      const demobytecode = "608060405234801561001057600080fd5b506004361061002b5760003560e01c80636057361d14610030575b600080fd5b61004a60048036038101906100459190610096565b61004c565b005b8060008190555050565b600080fd5b6000819050919050565b61006e8161005b565b811461007957600080fd5b50565b60008135905061008b81610065565b92915050565b6000602082840312156100a7576100a6610056565b5b60006100b58482850161007c565b91505092915050565b50505050fea2646970667358221220";
      
      setBytecode(demobytecode);
      toast({
        title: "컴파일 시뮬레이션 완료! ⚠️",
        description: "브라우저 환경에서는 실제 컴파일이 제한됩니다. Remix IDE 사용을 권장합니다.",
      });
    } catch (error: any) {
      console.error("Compilation error:", error);
      toast({
        title: "컴파일 실패",
        description: error.message || "컴파일 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsCompiling(false);
    }
  };

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        
        if (file.name.endsWith('.sol')) {
          setContractSource(content);
          toast({
            title: "Solidity 파일 업로드",
            description: `${file.name} 파일이 업로드되었습니다. 컴파일 버튼을 눌러주세요.`,
          });
        } else {
          try {
            const parsed = JSON.parse(content);
            setBytecode(parsed.bytecode || parsed.data || content);
            toast({
              title: "파일 업로드 성공",
              description: `${file.name} 파일에서 바이트코드를 추출했습니다.`,
            });
          } catch (error) {
            setBytecode(content);
            toast({
              title: "파일 업로드 완료",
              description: "바이트코드가 입력되었습니다.",
            });
          }
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

  const getExplorerUrl = (network: any, address: string, type: 'address' | 'tx' = 'address') => {
    if (!network.explorer) return null;
    return `${network.explorer}/${type}/${address}`;
  };

  const handleViewOnExplorer = () => {
    const network = networks.find(n => n.id === selectedNetwork);
    if (network && deploymentResult?.contractAddress) {
      const url = getExplorerUrl(network, deploymentResult.contractAddress, 'address');
      if (url) {
        window.open(url, '_blank');
      } else {
        toast({
          title: "익스플로러 지원 안함",
          description: "로컬 네트워크는 블록 익스플로러를 지원하지 않습니다.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCopyAddress = () => {
    if (deploymentResult?.contractAddress) {
      navigator.clipboard.writeText(deploymentResult.contractAddress);
      toast({
        title: "주소 복사됨",
        description: "컨트랙트 주소가 클립보드에 복사되었습니다.",
      });
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

            {/* Contract Source Input */}
            {contractSource && (
              <div className="space-y-2">
                <Label htmlFor="contract-source">Solidity 소스 코드</Label>
                <Textarea
                  id="contract-source"
                  value={contractSource}
                  onChange={(e) => setContractSource(e.target.value)}
                  className="web3-input min-h-[120px] font-mono text-sm"
                  placeholder="pragma solidity ^0.8.0;..."
                />
                <Button 
                  onClick={() => compileContract(contractSource)}
                  disabled={isCompiling || !contractSource}
                  className="web3-button"
                >
                  {isCompiling ? (
                    <div className="flex items-center space-x-2">
                      <div className="loading-spinner w-4 h-4" />
                      <span>컴파일 중...</span>
                    </div>
                  ) : (
                    "Solidity 컴파일"
                  )}
                </Button>
              </div>
            )}

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
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleViewOnExplorer}
                    disabled={!networks.find(n => n.id === selectedNetwork)?.explorer}
                  >
                    View on Explorer
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleCopyAddress}
                  >
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
