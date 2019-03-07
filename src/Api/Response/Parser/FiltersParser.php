<?php

namespace Findologic\Api\Response\Parser;

/**
 * Class FiltersParser
 * @package Findologic\Api\Response\Parser
 */
class FiltersParser
{
    /**
     * @var int
     */
    protected $valueId;

    /**
     * @param \SimpleXMLElement $data
     * @return array
     */
    public function parse($data)
    {
        $filters = [];

        if (!empty($data->filters)) {
            foreach ($data->filters->filter as $filter) {
                $filterName = $filter->name->__toString();
                $filterData = [
                    'id' => $filterName,
                    'name' => $filter->display->__toString(),
                    'select' => $filter->select->__toString(),
                    'type' => ''
                ];

                if ($filter->type) {
                    $filterData['type'] = $filter->type->__toString();
                }

                if ($filterName === 'price') {
                    $filterData['type'] = 'price';
                }

                foreach ($filter->items->item as $key => $item) {
                    $filterItem = [];
                    $this->parseFilterItem($filterData['type'], $filterItem, $item, $key);
                    if (!empty($filterItem)) {
                        $filterData['values'][] = $filterItem;
                    }
                }

                $filters[] = $filterData;
            }
        }

        return $filters;
    }

    /**
     * @param string $filterType
     * @param array $filterItem
     * @param \SimpleXMLElement $data
     * @param int $index
     * @return array
     */
    public function parseFilterItem($filterType, &$filterItem, $data, $index)
    {
        if (!empty($data)) {
            $filterItem['name'] = $data->name->__toString();
            $filterItem['position'] = $index;
            $filterItem['count'] = $data->frequency->__toString();
            $filterItem['image'] = $data->image->__toString();
            $filterItem['id'] = ++$this->valueId;

            if ($filterType === 'price') {
                $filterItem['priceMin'] = $data->parameters->min;
                $filterItem['priceMax'] = $data->parameters->max;
            }

            if (!empty($data->items)) {
                foreach ($data->items->item as $key => $item) {
                    $newItem = [];
                    $this->parseFilterItem($filterType, $newItem, $item, $key);
                    $filterItem['items'][] = $newItem;
                }
            }
        }
    }
}