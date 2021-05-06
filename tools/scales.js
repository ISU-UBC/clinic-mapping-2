export default class Scales {
    static GetChoroplethFn(features, id, color) {
        let featureArray = this.CreateFeatureArray(features, id);

        let max = d3.max(featureArray);

        return d3.scaleThreshold()
                    .domain([max * 0.25, max * 0.5, max * 0.75, max])
                    .range(color);
    }

    static GetProportionFn(features, id) {
        let featureArray = this.CreateFeatureArray(features, id);

        let max = d3.max(featureArray);

        return d3.scaleThreshold()
                    .domain([max * 0.25, max * 0.5, max * 0.75, max])
                    .range([0.03, 0.05, 0.075, 0.095]);
    }

    static GetIdentifierFn(features, id, color) {
        let featureArray = this.CreateFeatureArray(features, id);
        
        let removeDuplicates = new Set(featureArray);

        let data = Array.from(removeDuplicates);

        return d3.scaleOrdinal().domain(data).range(color);
    }

    static CreateFeatureArray(features, id) {
        let featureArray = [];
        features.forEach((feature) => {
            let f = feature.getProperties()[id];
            if(f == null) {
                return;
            }
            featureArray.push(f);
        });
        return featureArray;
    }
}