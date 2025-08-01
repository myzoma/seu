/**
 * Elliott Wave Analyzer
 * Analyzes price data to identify Elliott Wave patterns and make predictions
 */

class ElliottWaveAnalyzer {
  constructor() {
    this.fibonacciRatios = {
      wave2Retracement: [0.382, 0.5, 0.618],
      wave3Extension: [1.618, 2.618, 4.236],
      wave4Retracement: [0.236, 0.382, 0.5],
      waveARetracement: [0.618, 0.786, 0.886],
      waveBRetracement: [0.382, 0.5, 0.618],
      waveCExtension: [1.618, 2.618, 3.618]
    };
  }

  /**
   * Analyze price data to identify potential Elliott Wave patterns
   * @param {Array} priceData - Array of price data objects with OHLC values
   * @returns {Object} Analysis results including wave patterns and predictions
   */
  analyzeWaves(priceData) {
    if (!priceData || priceData.length < 30) {
      return {
        pattern: 'Insufficient data',
        confidence: 0,
        pivotPoints: [],
        waveLabels: [],
        predictions: null
      };
    }

    // Find pivot points (potential wave turning points)
    const pivotPoints = this.findPivotPoints(priceData);
    
    // Skip analysis if not enough pivot points found
    if (pivotPoints.length < 5) {
      return {
        pattern: 'Insufficient pivot points',
        confidence: 0,
        pivotPoints,
        waveLabels: [],
        predictions: null
      };
    }

    // Try to identify impulsive (5-wave) and corrective (3-wave) patterns
    const impulsePattern = this.identifyImpulsePattern(pivotPoints, priceData);
    const correctivePattern = this.identifyCorrectivePattern(pivotPoints, priceData);

    // Choose the pattern with higher confidence
    if (impulsePattern.confidence > correctivePattern.confidence) {
      return {
        ...impulsePattern,
        pivotPoints
      };
    } else {
      return {
        ...correctivePattern,
        pivotPoints
      };
    }
  }

  /**
   * Find potential pivot points (high and low turning points) in price data
   * @param {Array} priceData - Array of price data objects
   * @returns {Array} Array of pivot points with index and price values
   */
  findPivotPoints(priceData) {
    const pivotPoints = [];
    const lookbackPeriod = 5; // Number of bars to look back and forward

    // Find local maxima and minima
    for (let i = lookbackPeriod; i < priceData.length - lookbackPeriod; i++) {
      let isHigh = true;
      let isLow = true;

      // Check if current bar is a local high
      for (let j = i - lookbackPeriod; j <= i + lookbackPeriod; j++) {
        if (j !== i) {
          if (priceData[j].high >= priceData[i].high) {
            isHigh = false;
            break;
          }
        }
      }

      // Check if current bar is a local low
      for (let j = i - lookbackPeriod; j <= i + lookbackPeriod; j++) {
        if (j !== i) {
          if (priceData[j].low <= priceData[i].low) {
            isLow = false;
            break;
          }
        }
      }

      if (isHigh) {
        pivotPoints.push({
          index: i,
          price: priceData[i].high,
          time: priceData[i].time,
          type: 'high'
        });
      } else if (isLow) {
        pivotPoints.push({
          index: i,
          price: priceData[i].low,
          time: priceData[i].time,
          type: 'low'
        });
      }
    }

    // Sort pivot points by index (chronological order)
    return pivotPoints.sort((a, b) => a.index - b.index);
  }

  /**
   * Identify potential impulsive (5-wave) pattern
   * @param {Array} pivotPoints - Array of pivot points
   * @param {Array} priceData - Original price data
   * @returns {Object} Analysis of potential impulse pattern
   */
  identifyImpulsePattern(pivotPoints, priceData) {
    // We need at least 9 pivot points to identify a potential 5-wave structure
    if (pivotPoints.length < 9) {
      return { pattern: 'No impulse pattern found', confidence: 0, waveLabels: [], predictions: null };
    }

    let bestPattern = null;
    let highestConfidence = 0;

    // Try different combinations of pivot points to find the best match
    for (let i = 0; i < pivotPoints.length - 8; i++) {
      // Select 9 consecutive pivot points for analysis
      // (wave 1 start, wave 1 end/wave 2 start, wave 2 end/wave 3 start, etc.)
      const potentialPattern = pivotPoints.slice(i, i + 9);

      // Check if the alternating sequence of highs and lows makes sense for an impulsive pattern
      if (
        potentialPattern[0].type === 'low' &&
        potentialPattern[1].type === 'high' &&
        potentialPattern[2].type === 'low' &&
        potentialPattern[3].type === 'high' &&
        potentialPattern[4].type === 'low' &&
        potentialPattern[5].type === 'high' &&
        potentialPattern[6].type === 'low' &&
        potentialPattern[7].type === 'high' &&
        potentialPattern[8].type === 'low'
      ) {
        // Calculate wave heights
        const wave1Height = Math.abs(potentialPattern[1].price - potentialPattern[0].price);
        const wave2Height = Math.abs(potentialPattern[2].price - potentialPattern[1].price);
        const wave3Height = Math.abs(potentialPattern[3].price - potentialPattern[2].price);
        const wave4Height = Math.abs(potentialPattern[4].price - potentialPattern[3].price);
        const wave5Height = Math.abs(potentialPattern[5].price - potentialPattern[4].price);

        // Check Elliott Wave rules
        const isWave2SmallerThanWave1 = wave2Height < wave1Height;
        const isWave3Largest = wave3Height > wave1Height && wave3Height > wave5Height;
        const isWave4SmallerThanWave3 = wave4Height < wave3Height;
        const doesWave2NotExceedWave1Start = potentialPattern[2].price > potentialPattern[0].price;
        const doesWave4NotOverlapWave1 = potentialPattern[4].price > potentialPattern[1].price;

        // Calculate confidence based on how well the pattern matches Elliott Wave rules
        let confidence = 0;
        
        if (isWave2SmallerThanWave1) confidence += 20;
        if (isWave3Largest) confidence += 25;
        if (isWave4SmallerThanWave3) confidence += 20;
        if (doesWave2NotExceedWave1Start) confidence += 15;
        if (doesWave4NotOverlapWave1) confidence += 20;

        // Check if this pattern is better than previously found ones
        if (confidence > highestConfidence) {
          highestConfidence = confidence;
          
          // Determine current position within the wave structure
          let currentPosition;
          const lastPivotIndex = pivotPoints.length - 1;
          
          if (i + 8 === lastPivotIndex) {
            currentPosition = 'Completed 5-wave sequence';
          } else if (i + 6 === lastPivotIndex) {
            currentPosition = 'In wave 5';
          } else if (i + 4 === lastPivotIndex) {
            currentPosition = 'In wave 4';
          } else if (i + 2 === lastPivotIndex) {
            currentPosition = 'In wave 3';
          } else if (i === lastPivotIndex) {
            currentPosition = 'In wave 2';
          } else {
            currentPosition = 'Developing new pattern';
          }
          
          // Make predictions based on current position
          let predictions = null;
          
          if (i + 6 === lastPivotIndex) {
            // Predict wave 5 target
            const wave1to3Length = Math.abs(potentialPattern[3].price - potentialPattern[0].price);
            const wave5Target = potentialPattern[4].price + (wave1to3Length * 0.618);
            
            predictions = {
              target: wave5Target,
              confidence: confidence * 0.9 // Slightly reduce prediction confidence
            };
          }
          
          bestPattern = {
            pattern: `Impulse - ${currentPosition}`,
            confidence,
            waveLabels: [
              { index: potentialPattern[0].index, label: '0', price: potentialPattern[0].price },
              { index: potentialPattern[1].index, label: '1', price: potentialPattern[1].price },
              { index: potentialPattern[2].index, label: '2', price: potentialPattern[2].price },
              { index: potentialPattern[3].index, label: '3', price: potentialPattern[3].price },
              { index: potentialPattern[4].index, label: '4', price: potentialPattern[4].price },
              { index: potentialPattern[5].index, label: '5', price: potentialPattern[5].price }
            ],
            predictions
          };
        }
      }
    }

    if (bestPattern) {
      return bestPattern;
    }

    return { pattern: 'No impulse pattern found', confidence: 0, waveLabels: [], predictions: null };
  }

  /**
   * Identify potential corrective (3-wave) pattern
   * @param {Array} pivotPoints - Array of pivot points
   * @param {Array} priceData - Original price data
   * @returns {Object} Analysis of potential corrective pattern
   */
  identifyCorrectivePattern(pivotPoints, priceData) {
    // Need at least 5 pivot points for a 3-wave structure (A-B-C)
    if (pivotPoints.length < 5) {
      return { pattern: 'No corrective pattern found', confidence: 0, waveLabels: [], predictions: null };
    }

    let bestPattern = null;
    let highestConfidence = 0;

    // Try different combinations of pivot points
    for (let i = 0; i < pivotPoints.length - 4; i++) {
      // Select 5 consecutive pivot points (start, A, B, C, end)
      const potentialPattern = pivotPoints.slice(i, i + 5);

      // Check if the sequence makes sense for a corrective pattern
      if (
        (potentialPattern[0].type === 'high' &&
         potentialPattern[1].type === 'low' &&
         potentialPattern[2].type === 'high' &&
         potentialPattern[3].type === 'low' &&
         potentialPattern[4].type === 'high') ||
        (potentialPattern[0].type === 'low' &&
         potentialPattern[1].type === 'high' &&
         potentialPattern[2].type === 'low' &&
         potentialPattern[3].type === 'high' &&
         potentialPattern[4].type === 'low')
      ) {
        const waveAHeight = Math.abs(potentialPattern[1].price - potentialPattern[0].price);
        const waveBHeight = Math.abs(potentialPattern[2].price - potentialPattern[1].price);
        const waveCHeight = Math.abs(potentialPattern[3].price - potentialPattern[2].price);

        // Check Elliott Wave rules for corrections
        const isBRetracement = waveBHeight < waveAHeight;
        const isCExtension = Math.abs(waveCHeight / waveAHeight - 0.618) < 0.2 ||
                             Math.abs(waveCHeight / waveAHeight - 1.0) < 0.2 ||
                             Math.abs(waveCHeight / waveAHeight - 1.618) < 0.2;

        // Calculate confidence
        let confidence = 0;
        
        if (isBRetracement) confidence += 35;
        if (isCExtension) confidence += 30;
        confidence += 25; // Base confidence

        if (confidence > highestConfidence) {
          highestConfidence = confidence;
          
          // Determine current position
          let currentPosition;
          const lastPivotIndex = pivotPoints.length - 1;
          
          if (i + 4 === lastPivotIndex) {
            currentPosition = 'Completed ABC sequence';
          } else if (i + 2 === lastPivotIndex) {
            currentPosition = 'In wave C';
          } else if (i === lastPivotIndex) {
            currentPosition = 'In wave B';
          } else {
            currentPosition = 'Developing new pattern';
          }
          
          // Predictions
          let predictions = null;
          
          if (i + 2 === lastPivotIndex) {
            // Predict C target
            const waveCTarget = potentialPattern[2].price + (waveAHeight * 1.618);
            
            predictions = {
              target: waveCTarget,
              confidence: confidence * 0.8 // Reduced confidence for corrections
            };
          }
          
          bestPattern = {
            pattern: `Corrective ABC - ${currentPosition}`,
            confidence,
            waveLabels: [
              { index: potentialPattern[0].index, label: 'Start', price: potentialPattern[0].price },
              { index: potentialPattern[1].index, label: 'A', price: potentialPattern[1].price },
              { index: potentialPattern[2].index, label: 'B', price: potentialPattern[2].price },
              { index: potentialPattern[3].index, label: 'C', price: potentialPattern[3].price }
            ],
            predictions
          };
        }
      }
    }

    if (bestPattern) {
      return bestPattern;
    }

    return { pattern: 'No corrective pattern found', confidence: 0, waveLabels: [], predictions: null };
  }

  /**
   * Calculate Fibonacci retracement levels
   * @param {number} startPrice - Starting price
   * @param {number} endPrice - Ending price
   * @returns {Object} Fibonacci retracement levels
   */
  calculateFibonacciLevels(startPrice, endPrice) {
    const diff = endPrice - startPrice;
    
    return {
      level0: endPrice, // 0% retracement
      level23_6: endPrice - diff * 0.236, // 23.6% retracement
      level38_2: endPrice - diff * 0.382, // 38.2% retracement
      level50_0: endPrice - diff * 0.5, // 50% retracement
      level61_8: endPrice - diff * 0.618, // 61.8% retracement
      level78_6: endPrice - diff * 0.786, // 78.6% retracement
      level100: startPrice, // 100% retracement
      level161_8: startPrice - diff * 0.618, // 161.8% extension
      level261_8: startPrice - diff * 1.618 // 261.8% extension
    };
  }
}

export default ElliottWaveAnalyzer;