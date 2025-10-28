import React, { useState, useEffect } from 'react';
import { VTOKENS } from '../config/bifrost';
import { toast } from 'sonner';
import { 
  Brain, 
  TrendingUp, 
  Shield, 
  Zap, 
  Target, 
  Lightbulb,
  ArrowRight,
  Star,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StakingRecommendation {
  token: string;
  underlying: string;
  apy: number;
  riskLevel: 'low' | 'medium' | 'high';
  reason: string;
  recommendedAmount: string;
  pros: string[];
  cons: string[];
  score: number;
  color: string;
}

interface UserProfile {
  riskTolerance: 'conservative' | 'balanced' | 'aggressive';
  investmentAmount: number;
  preferredChains: string[];
  experience: 'beginner' | 'intermediate' | 'advanced';
}

const IntelligentStakingAssistant: React.FC = () => {
  const { t } = useTranslation();
  const [recommendations, setRecommendations] = useState<StakingRecommendation[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    riskTolerance: 'balanced',
    investmentAmount: 1000,
    preferredChains: ['polkadot'],
    experience: 'intermediate'
  });
  const [loading, setLoading] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(true);

  // AI 驱动的质押建议算法
  useEffect(() => {
    generateRecommendations();
  }, [userProfile]);

  const generateRecommendations = async () => {
    setLoading(true);
    
    try {
      // 模拟 AI 分析延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 基于用户画像和市场数据生成建议
      const allTokens = Object.entries(VTOKENS);
      const recs: StakingRecommendation[] = [];

      for (const [symbol, config] of allTokens) {
        const recommendation = analyzeTokenForUser(symbol, config, userProfile);
        if (recommendation) {
          recs.push(recommendation);
        }
      }

      // 按分数排序
      recs.sort((a, b) => b.score - a.score);
      
      setRecommendations(recs.slice(0, 3)); // 返回前3个推荐
      
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      toast.error(t('aiAssistant.error'));
    } finally {
      setLoading(false);
    }
  };

  const analyzeTokenForUser = (
    symbol: string, 
    config: any, 
    profile: UserProfile
  ): StakingRecommendation | null => {
    
    // 模拟市场数据
    const marketData = {
      'vDOT': { apy: 12.5, liquidity: 'high', popularity: 'very_high' },
      'vKSM': { apy: 15.2, liquidity: 'medium', popularity: 'high' },
      'vGLMR': { apy: 18.7, liquidity: 'medium', popularity: 'medium' },
      'vASTR': { apy: 14.3, liquidity: 'high', popularity: 'high' },
      'vFIL': { apy: 16.8, liquidity: 'low', popularity: 'low' }
    };

    const data = marketData[symbol as keyof typeof marketData];
    if (!data) return null;

    // 计算风险等级
    let riskScore = 0;
    const pros: string[] = [];
    const cons: string[] = [];

    // 基础评分
    let score = 50;

    // APY 评分 (30%)
    if (data.apy > 15) {
      score += 15;
      pros.push('高收益率');
    } else if (data.apy > 12) {
      score += 10;
      pros.push('良好收益率');
    } else {
      score += 5;
      pros.push('稳定收益率');
    }

    // 流动性评分 (25%)
    if (data.liquidity === 'high') {
      score += 15;
      pros.push('高流动性，易于交易');
    } else if (data.liquidity === 'medium') {
      score += 10;
      pros.push('中等流动性');
    } else {
      score += 5;
      cons.push('流动性较低');
    }

    // 受欢迎程度评分 (20%)
    if (data.popularity === 'very_high') {
      score += 12;
      pros.push('市场认可度高');
    } else if (data.popularity === 'high') {
      score += 8;
      pros.push('受欢迎程度高');
    } else {
      score += 3;
      cons.push('相对小众');
    }

    // 用户偏好调整 (15%)
    if (profile.preferredChains.includes(config.chain)) {
      score += 10;
      pros.push('符合您的链偏好');
    }

    // 风险承受能力调整 (10%)
    if (profile.riskTolerance === 'conservative' && data.liquidity === 'low') {
      score -= 15;
      cons.push('流动性风险较高');
    } else if (profile.riskTolerance === 'aggressive' && data.apy > 15) {
      score += 8;
      pros.push('符合您的风险偏好');
    }

    // 经验水平调整
    if (profile.experience === 'beginner' && data.popularity !== 'very_high') {
      score -= 5;
      cons.push('适合有经验的用户');
    }

    // 确定风险等级
    let riskLevel: 'low' | 'medium' | 'high';
    if (data.liquidity === 'high' && data.popularity === 'very_high') {
      riskLevel = 'low';
    } else if (data.liquidity === 'low' || data.popularity === 'low') {
      riskLevel = 'high';
    } else {
      riskLevel = 'medium';
    }

    // 生成推荐理由
    let reason = '';
    if (score >= 80) {
      reason = `强烈推荐：${config.description}，具有优秀的收益率和流动性，是您的理想选择。`;
    } else if (score >= 65) {
      reason = `推荐：${config.description}，平衡了收益和风险，适合您的投资偏好。`;
    } else if (score >= 50) {
      reason = `可考虑：${config.description}，需要权衡收益与风险。`;
    } else {
      reason = `谨慎考虑：${config.description}，风险较高或收益一般。`;
    }

    // 计算推荐金额
    const recommendedAmount = Math.min(
      profile.investmentAmount * (score / 100),
      profile.investmentAmount * 0.6
    ).toFixed(0);

    return {
      token: symbol,
      underlying: config.underlying,
      apy: data.apy,
      riskLevel,
      reason,
      recommendedAmount,
      pros,
      cons,
      score,
      color: config.color
    };
  };

  const handleProfileSetup = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowProfileSetup(false);
  };

  const handleInvest = (recommendation: StakingRecommendation) => {
    toast.success(`已为您准备投资 ${recommendation.recommendedAmount} ${recommendation.underlying} 到 ${recommendation.token}`);
    // 这里可以触发实际的铸造流程
  };

  if (showProfileSetup) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-900">AI 智能质押助手</h3>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <Lightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">让我们了解您的投资偏好</h4>
            <p className="text-gray-600">基于您的风险承受能力和投资目标，我们将为您提供个性化的质押建议</p>
          </div>

          {/* 风险承受能力 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              您的风险承受能力？
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'conservative', label: '保守型', desc: '优先考虑安全性' },
                { value: 'balanced', label: '平衡型', desc: '平衡收益与风险' },
                { value: 'aggressive', label: '激进型', desc: '追求高收益' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setUserProfile(prev => ({ ...prev, riskTolerance: option.value as any }))}
                  className={`p-3 border-2 rounded-lg text-center transition-all ${
                    userProfile.riskTolerance === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 投资金额 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              预计投资金额 (USD)
            </label>
            <input
              type="number"
              value={userProfile.investmentAmount}
              onChange={(e) => setUserProfile(prev => ({ ...prev, investmentAmount: parseInt(e.target.value) || 0 }))}
              placeholder="输入投资金额"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 经验水平 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              您的 DeFi 经验水平？
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'beginner', label: '新手', desc: '刚开始接触' },
                { value: 'intermediate', label: '中级', desc: '有一些经验' },
                { value: 'advanced', label: '高级', desc: '经验丰富' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setUserProfile(prev => ({ ...prev, experience: option.value as any }))}
                  className={`p-3 border-2 rounded-lg text-center transition-all ${
                    userProfile.experience === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleProfileSetup(userProfile)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <Brain className="w-5 h-5" />
            生成个性化建议
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-900">AI 智能质押助手</h3>
        </div>
        
        <button
          onClick={() => setShowProfileSetup(true)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          重新设置
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">AI 正在分析市场数据...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {recommendations.map((rec, index) => (
            <div key={rec.token} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              {/* 推荐卡片头部 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: rec.color }}
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{rec.token}</h4>
                    <p className="text-sm text-gray-600">{rec.underlying} 流动性质押代币</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-lg font-bold text-green-600">{rec.apy}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {rec.riskLevel === 'low' && <Shield className="w-4 h-4 text-green-600" />}
                    {rec.riskLevel === 'medium' && <AlertCircle className="w-4 h-4 text-yellow-600" />}
                    {rec.riskLevel === 'high' && <AlertCircle className="w-4 h-4 text-red-600" />}
                    <span className="text-xs text-gray-600 capitalize">{rec.riskLevel} 风险</span>
                  </div>
                </div>
              </div>

              {/* 推荐理由 */}
              <p className="text-sm text-gray-700 mb-4">{rec.reason}</p>

              {/* 优缺点 */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h5 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    优势
                  </h5>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {rec.pros.map((pro, i) => (
                      <li key={i}>• {pro}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-orange-700 mb-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    注意事项
                  </h5>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {rec.cons.map((con, i) => (
                      <li key={i}>• {con}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 推荐金额和操作 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">
                    推荐投资: <span className="font-semibold text-gray-900">${rec.recommendedAmount}</span>
                  </span>
                </div>
                
                <button
                  onClick={() => handleInvest(rec)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  一键投资
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* 评分 */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">AI 匹配度</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(rec.score / 20) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-600 ml-1">{rec.score}/100</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IntelligentStakingAssistant;